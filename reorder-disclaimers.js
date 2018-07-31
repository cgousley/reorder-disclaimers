/*
* Reorder Disclosures
*
* This will automatically rearrange the superscripts and footer footnote li so they are in numerical order.
*
* Superscripts must be labeled with
*
*       data-ref="footnotes"
*
* Ordered list containing footnotes must be labeled by
*
*       data-ref-by="footnotes"
*
*/

function reorderDisclaimers() {
  // Test element visibility (we don't count hidden elements)
  var checkVisible = (el) => (el.offsetWidth > 0 || el.offsetHeight > 0);

  // When sections are loaded, reorder superscripts
  if (document.querySelectorAll('[data-ref="footnotes"]')) {
    let elChecked = [];
    let newOrder = [];
    // get all superscripts, visible or not
    const allSups = document.querySelectorAll('[data-ref="footnotes"]');
    // filter to get only visible superscripts
    const visSups = [].slice.call(allSups).filter(el => checkVisible(el));// Array.from not supported in IE 8.
    let skipOffset = 0;
    const supElLen = visSups.length;

    // Generate new superscript
    // for loops are faster than forEach
    for (let i = 0; i < supElLen; i++) {
      const el = visSups[i];
      const isRepeat = (elChecked.indexOf(el.innerText) !== -1);
      const currentSupNumber = el.innerText;
      const correctSupNumber = (isRepeat) // Was number checked already?
        // True: Fetch index from elChecked array
        // Add 1 to offset JS 0-index system
        ? (elChecked.indexOf(currentSupNumber) + 1)
        // False: use number's index from visSups array
        // Add 1 to offset JS 0-index system
        // Subract the number already skipped so far
        : (i + (1 - skipOffset));
      newOrder.push(correctSupNumber);
      el.innerText = correctSupNumber;

      // Only push sup text into elChecked if it's not there yet
      // The index stored in elCheck will be used if the sup repeats
      // Increment skip offset only if the el was repeated.
      (!isRepeat) ? elChecked.push(currentSupNumber) : skipOffset++;

    }

    // When footer footnotes section is loaded, reorder footer footnotes
    if (document.querySelector('[data-ref-by="footnotes"]')) {
      const footnotesContainer = document.querySelectorAll('[data-ref-by="footnotes"]');
      const footnotes = footnotesContainer[0].children;
      const newFootnotes = document.createDocumentFragment();

      // Reorder Footnotes
      for (let el of elChecked) newFootnotes.appendChild(footnotes[el - 1].cloneNode(true))
      footnotesContainer[0].innerHTML = null;
      footnotesContainer[0].appendChild(newFootnotes);
    }
  }
}

reorderDisclaimers();
