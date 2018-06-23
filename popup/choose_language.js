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

async function CreateButtons() {
  const prefs = await browser.storage.local.get();
  const currentvalue = prefs.currentvalue || "";

  prefs.menuentries.forEach((entry) => {
    const div = document.createElement("div");
    if (entry[1] == currentvalue)
      div.setAttribute("class", "button selected");
    else
      div.setAttribute("class", "button");
    div.setAttribute("data-value", entry[1]);
    div.textContent = entry[0];
    document.body.appendChild(div);
  });
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("button")) {
    const value = e.target.getAttribute("data-value");
    browser.extension.getBackgroundPage().SetCurrentValue(value);
    window.close();
  }
});

CreateButtons();
