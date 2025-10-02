import Heading from "../ui/Heading";
import UpadateSettingsForm from "../features/settings/UpadateSettingsForm";
import Row from "../ui/Row";

function Settings() {
  return (
    <Row>
      <Heading as="h1">Update hotel settings</Heading>;
      <UpadateSettingsForm />
    </Row>
  );
}

export default Settings;
