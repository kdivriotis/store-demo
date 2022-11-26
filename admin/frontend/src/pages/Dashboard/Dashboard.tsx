import { FC, useState, useEffect, useMemo, useContext } from "react";

import { useHttp } from "../../hooks";

import { AuthContext } from "../../context";
import { AuthContextType } from "../../interfaces/AuthContext";

import {
  DateSelectionBy,
  ProductStatistics,
  OrderAnalyticStatistics,
  OrderStatistics,
} from "../../interfaces/Statistics";

import {
  SelectDate,
  WidgetsContainer,
  Charts,
} from "../../components/Dashboard";

interface ApiResponse {
  allPartners: number;
  activePartners: number;
  income: number;
  orders: number;
  products: ProductStatistics[];
  statistics: OrderAnalyticStatistics[];
}

// number of months in year
const monthsInYear: number = 12;
const monthNames: string[] = [
  "Ιανουάριος",
  "Φεβρουάριος",
  "Μάρτιος",
  "Απρίλιος",
  "Μάιος",
  "Ιούνιος",
  "Ιούλιος",
  "Αύγουστος",
  "Σεπτέμβριος",
  "Οκτώβριος",
  "Νοέμβριος",
  "Δεκέμβριος",
];

// Available years for dropdown (last 10 years)
const availableYears = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((offset) => {
  const currentYear: number = new Date().getFullYear();
  return currentYear - offset;
});

// number of days in month (28, 29, 30 or 31) - month is 1-12
const daysInMonth = (year: number, month: number): number => {
  const isLeapYear: boolean =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

const displayIntTwoDigits = (digit: number) => {
  let result = "";
  if (digit < 10) {
    result = `0${digit}`;
  } else {
    result = `${digit}`;
  }
  return result;
};

const hoursInDay: string[] = Array.from({ length: 24 }, (_, i) => i).map(
  (hour) => `${displayIntTwoDigits(hour)}:00`
);

const Dashboard: FC = () => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { isLoading, error, sendRequest } = useHttp();

  // Date selection data (selectionBy, selectedYear, selectedMonth, selectedDay)
  const [selectionBy, setSelectionBy] = useState<DateSelectionBy>(
    DateSelectionBy.Month
  );
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());
  const maxSelectedDay = useMemo(
    () => daysInMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  useEffect(() => {
    if (selectedYear > currentDate.getFullYear())
      setSelectedYear(currentDate.getFullYear());

    if (selectedMonth > monthsInYear || selectedMonth < 1)
      setSelectedMonth(currentDate.getMonth());

    if (selectedDay > maxSelectedDay || selectedDay < 1)
      setSelectedDay(maxSelectedDay);
  }, [selectedYear, selectedMonth, selectedDay]);

  const availableDays = useMemo(
    () =>
      Array.from({ length: maxSelectedDay }, (_, i) => i + 1).map((day) => {
        return { value: day, description: `${day}` };
      }),
    [maxSelectedDay]
  );

  // Statistics data
  const [allPartners, setAllPartners] = useState<number>(0);
  const [activePartners, setActivePartners] = useState<number>(0);
  const [orders, setOrders] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [products, setProducts] = useState<ProductStatistics[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics[]>([]);
  const [xAxis, setXAxis] = useState<string[]>([]);

  // Function to get all statistics for selected dates
  const getStatistics = () => {
    // transform API response and set state
    const transformResponse = (response: ApiResponse) => {
      setAllPartners(response.allPartners);
      setActivePartners(response.activePartners);
      setOrders(response.orders);
      setIncome(response.income);
      setProducts(response.products);

      // transform OrderAnalyticStatistics[] to OrderStatistics[] by setting non-existing data to 0
      let tempStatistics: OrderStatistics[] = [];
      switch (selectionBy) {
        // Display statistics per month for selected year
        case DateSelectionBy.Year:
          setXAxis(monthNames);
          tempStatistics = Array.from({ length: monthNames.length }, (_, i) => {
            return {
              orders: 0,
              income: 0,
            };
          });

          for (let stat of response.statistics) {
            if (
              stat.month !== undefined &&
              stat.month - 1 < tempStatistics.length
            ) {
              tempStatistics[stat.month - 1] = {
                orders: stat.orders,
                income: stat.income,
              };
            }
          }
          break;
        // Display statistics per day for selected month
        case DateSelectionBy.Month:
          setXAxis(availableDays.map((day) => day.description));
          tempStatistics = Array.from(
            { length: availableDays.length },
            (_, i) => {
              return {
                orders: 0,
                income: 0,
              };
            }
          );
          for (let stat of response.statistics) {
            if (
              stat.day !== undefined &&
              stat.day - 1 < tempStatistics.length
            ) {
              tempStatistics[stat.day - 1] = {
                orders: stat.orders,
                income: stat.income,
              };
            }
          }
          break;
        // Display statistics per hour for selected day
        case DateSelectionBy.Day:
          setXAxis(hoursInDay);
          tempStatistics = Array.from({ length: hoursInDay.length }, (_, i) => {
            return {
              orders: 0,
              income: 0,
            };
          });
          for (let stat of response.statistics) {
            if (stat.hour !== undefined && stat.hour < tempStatistics.length) {
              tempStatistics[stat.hour] = {
                orders: stat.orders,
                income: stat.income,
              };
            }
          }
          break;
        default:
          setXAxis([]);
          tempStatistics = [];
      }
      setStatistics(tempStatistics);
    };

    // send GET request to API's route /admin/order/statistics/:year/:month?/:day?
    let urlParams = `/${selectedYear}`;
    if (selectionBy > DateSelectionBy.Year) {
      urlParams += `/${selectedMonth}`;
    }
    if (selectionBy > DateSelectionBy.Month) {
      urlParams += `/${selectedDay}`;
    }

    const url = `${process.env.REACT_APP_API_URL}/admin/order/statistics${urlParams}`;
    sendRequest({ url, method: "GET", token: auth.token }, transformResponse);
  };

  useEffect(getStatistics, [
    selectionBy,
    selectedDay,
    selectedMonth,
    selectedYear,
  ]);

  return (
    <>
      <SelectDate
        isDisabled={isLoading}
        selectionBy={selectionBy}
        setSelectionBy={setSelectionBy}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        availableYears={availableYears}
        monthNames={monthNames}
        availableDays={availableDays}
      />
      {error && error.trim() !== "" && <p className="text-error">{error}</p>}
      <WidgetsContainer
        isLoading={isLoading}
        allPartners={allPartners}
        activePartners={activePartners}
        orders={orders}
        income={income}
      />
      <Charts
        isLoading={isLoading}
        products={products}
        statistics={statistics}
        xAxis={xAxis}
      />
    </>
  );
};

export default Dashboard;
