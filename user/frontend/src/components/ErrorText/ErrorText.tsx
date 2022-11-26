import { FC } from "react";

interface ErrorTextProps {
  message?: string | null;
}

const ErrorText: FC<ErrorTextProps> = ({ message }) => {
  return (
    <p className="text-error section-padding">
      Προέκυψε το παρακάτω σφάλμα κατά την επικοινωνία με τον εξυπηρετητή:
      <br />
      {message}
      <br />
      Ελέγξτε τη σύνδεσή σας στο διαδίκτυο και προσπαθήστε ξανά
    </p>
  );
};

export default ErrorText;
