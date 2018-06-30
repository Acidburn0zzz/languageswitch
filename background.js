/*
    Firefox addon "Language Switch"
    Copyright (C) 2018  Manuel Reimer <manuel.reimer@gmx.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Holds the current Accept-Language value
let gAcceptLanguage;

// Loads settings from storage
// Also prepares a default set of menu entries if nothing is stored.
// They are only here as an example and to have some entries directly
// after installation.
// Please *NO* pull-requests to add your language here!
async function LoadSettings() {
  const prefs = await browser.storage.local.get();

  const currentvalue = prefs.currentvalue || "";
  gAcceptLanguage = LanguageStringToAcceptLanguage(currentvalue);

  if (!prefs.menuentries) {
    const menuentries = [
      [browser.i18n.getMessage("menuentryDefault"),  ""],
      [browser.i18n.getMessage("menuentryEnglish"),  "en-US,en"],
      [browser.i18n.getMessage("menuentryFrench"),   "fr-FR,fr,en-US,en"],
      [browser.i18n.getMessage("menuentryGerman"),   "de-DE,de,en-US,en"],
      [browser.i18n.getMessage("menuentryJapanese"), "ja,en-US,en"],
      [browser.i18n.getMessage("menuentrySpanish"),  "es-ES,es,en-US,en"]
    ];
    await browser.storage.local.set({menuentries: menuentries});
  }
}

// Converts language list (as given by user) to the correct format for the
// Accept-Language header (auto-generate quality values)
function LanguageStringToAcceptLanguage(aLangString) {
  const inputlist = aLangString.split(",");
  const outputlist = [];
  const digits = (inputlist.length > 10) ? 2 : 1;
  for (let index = 0; index < inputlist.length; index++) {
    if (index == 0)
      outputlist.push(inputlist[0]);
    else {
      const quality = (inputlist.length - index) / inputlist.length;
      outputlist.push(inputlist[index] + ";q=" + quality.toFixed(digits));
    }
  }
  return outputlist.join(",");
}

// Setter for the current language string
// Also stores the changed value
function SetCurrentValue(aValue) {
  browser.storage.local.set({currentvalue: aValue});
  gAcceptLanguage = LanguageStringToAcceptLanguage(aValue);
}

// Header rewrite handler. Rewrites "Accept-Language".
function RewriteAcceptLanguage(e) {
  if (gAcceptLanguage != "") {
    e.requestHeaders.forEach(function(header){
      if (header.name.toLowerCase() == "accept-language")
        header.value = gAcceptLanguage;
    });
  }
  return {requestHeaders: e.requestHeaders};
}

// Register header listener
browser.webRequest.onBeforeSendHeaders.addListener(
  RewriteAcceptLanguage,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);

// Load settings
LoadSettings();
