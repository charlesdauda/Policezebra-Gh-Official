import ContactConnect from "../components/ContactConnect";
import ContactLocations from "../components/ContactLocations";
import ContactMap from "../components/ContactMap";
import PageHeader from "../components/PageHeader";

const Contact = () => {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        outline="let's"
        title="talk."
        description="Questions about an order, sizing or the collection? Reach us however works best for you. We usually reply fast."
        crumb="Contact"
      />
      <ContactLocations />
      <ContactMap />
      <ContactConnect />
    </>
  );
};

export default Contact;