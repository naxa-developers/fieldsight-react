import { addLocaleData } from "react-intl";

import enLocaleData from "react-intl/locale-data/en";
import deLocaleData from "react-intl/locale-data/de";
import frLocaleData from "react-intl/locale-data/fr";
import esLocaleData from "react-intl/locale-data/es";
import csLocaleData from "react-intl/locale-data/cs";
import skLocaleData from "react-intl/locale-data/sk";
import jaLocaleData from "react-intl/locale-data/ja";
import neLocaleData from "react-intl/locale-data/ne";

export const localeData = [
  enLocaleData,
  deLocaleData,
  frLocaleData,
  esLocaleData,
  csLocaleData,
  skLocaleData,
  jaLocaleData,
  neLocaleData
];

export const addAppLocaleData = () =>
  localeData.forEach(locale => addLocaleData(locale));
