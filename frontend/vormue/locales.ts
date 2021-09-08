import { MixedLocale, NumberLocale, StringLocale } from 'yup/lib/locale';

/* eslint-disable no-template-curly-in-string */

interface Locales {
  mixed: MixedLocale;
  number: NumberLocale;
  string: StringLocale;
}

const locales: Locales = {
  mixed: {
    required: 'Dieses Feld ist ein Pflichtfeld',
    default: 'Dieses Feld ist ein Pflichtfeld',
    notType: 'Bitte einen gültigen Wert eintragen.',
    defined: 'Dieses Feld ist ein Pflichtfeld',
  },

  number: {
    min: 'Der Wert muss mindestens ${min} betragen.',
    max: 'Der Wert kann maximal ${max} betragen.',
  },

  string: {
    min: 'Es müssen mindestens ${min} Zeichen verwendet werden.',
    email: 'Bitte eine gültige E-Mail Adresse eintragen.',
    uuid: 'Bitte einen gültigen Wert eintragen.',
  },
};

export default locales;
