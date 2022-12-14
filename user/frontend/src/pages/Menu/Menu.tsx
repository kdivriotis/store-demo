import { FC } from "react";

import { Navbar, TextSection, Footer } from "../../components";
import { ItemsList } from "../../components/Menu";

const Menu: FC = () => {
  return (
    <>
      <Navbar showImage={false} />
      <TextSection
        paragraphs={[
          "Η αγάπη μας για τις κρέπες χωράει σε κάθε ώρα της ημέρας, είτε αλμυρές για ένα νόστιμο γεύμα ή πρωινό, είτε γλυκές για το επιδόρπιο. Γι'αυτό σας προσφέρουμε μια μεγάλη ποικιλία από κρέπες που σας καλύπτουν κάθε στιγμή της ημέρας!",
          "Δείτε τον κατάλογο με τις κρέπες που προσφέρουμε, αλλά μην ξεχνάτε να παρακολουθείτε τα ΝΕΑ μας, ώστε να μη χάνετε τις ...special γεύσεις που σερβίρουμε κάθε μήνα!",
        ]}
        note="*Για πληροφορίες σχετικά με αλλεργιογόνα συστατικά τροφίμων επικοινωνήστε μαζί μας, ώστε να σας ενημερώσουμε αναλυτικά για όλα τα συστατικά που χρησιμοποιούνται σε κάθε προϊόν"
      />
      <ItemsList />
      <Footer />
    </>
  );
};

export default Menu;
