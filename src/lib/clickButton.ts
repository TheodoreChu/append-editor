import { HtmlElementId } from '../components/AppendEditor';

export const clickAppendButton = () => {
  const appendButton = document.getElementById(HtmlElementId.appendButton);
  if (appendButton) {
    appendButton.click();
  }
};

export const clickEditButton = () => {
  const editButton = document.getElementById(HtmlElementId.editButton);
  if (editButton) {
    editButton.click();
  }
};

export const clickHelpButton = () => {
  const helpButton = document.getElementById(HtmlElementId.helpButton);
  if (helpButton) {
    helpButton.click();
  }
};

export const clickMenuButton = () => {
  const menuButton = document.getElementById(HtmlElementId.menuButton);
  if (menuButton) {
    menuButton.click();
  }
};

export const clickSettingsButton = () => {
  const settingsButton = document.getElementById(HtmlElementId.settingsButton);
  if (settingsButton) {
    settingsButton.click();
  }
};

export const clickViewButton = () => {
  const viewButton = document.getElementById(HtmlElementId.viewButton);
  if (viewButton) {
    viewButton.click();
  }
};
