function htmlToElement(html) {
  const template = document.createElement("template")
  html = html.trim()
  template.innerHTML = html
  return template.content.firstChild
}

function findHeaderWithoutPunctuation(header, content) {
  let loweredContent = content.toLowerCase()
  let pos = -1
  let search = true
  while (search) {
    pos = loweredContent.indexOf("<h4>", pos+1)
    if (pos == -1) {
      search = false
    } else {
      let endPos = loweredContent.indexOf("</h4>", pos)
      if (endPos == -1) {
        return -1
      } else {
        let candidate = loweredContent.substring(pos + 4, endPos).replace(/[.,\/#!$'%\^&\*;:{}=\-_`~()]/g,"")
        if (candidate == header) {
          if (pos >= 7 && loweredContent.substring(pos - 7, pos) == "&nbsp;\n") {
            search = false
          }
        }
      }
    }
  }
  return pos
}

function initPopover(baseURL, useContextualBacklinks, renderLatex) {
  const basePath = baseURL.replace(window.location.origin, "")
  fetchData.then(({ content }) => {
    const links = [...document.getElementsByClassName("internal-link")]
    links
      .filter(li => li.dataset.src || (li.dataset.idx && useContextualBacklinks))
      .forEach(li => {
        var el
        if (li.dataset.ctx) {
          const linkDest = content[li.dataset.src]
          const popoverElement = `<div class="popover">
    <h3>${linkDest.title}</h3>
    <p>${highlight(removeMarkdown(linkDest.content), li.dataset.ctx)}...</p>
    <p class="meta">${new Date(linkDest.lastmodified).toLocaleDateString()}</p>
</div>`
          el = htmlToElement(popoverElement)
        } else {
          const linkDest = content[li.dataset.src.replace(/\/$/g, "").replace(basePath, "")]
          if (linkDest) {
            let splitLink = li.href.split("#")
            let cleanedContent = removeMarkdown(linkDest.content)
            if (splitLink.length > 1) {
              let headingName = splitLink[1].replace("-vyl-wnanory", "").replace(/\-/g, " ")
              let headingIndex = findHeaderWithoutPunctuation(headingName, cleanedContent)
              cleanedContent = cleanedContent.substring(headingIndex, cleanedContent.length)
            }
            const popoverElement = `<div class="popover">
    <h3>${linkDest.title}</h3>
    <hr>
    <div>${cleanedContent.split(" ", 20).join(" ")}...</div>
    <p class="meta">${new Date(linkDest.lastmodified).toLocaleDateString()}</p>
</div>`
            el = htmlToElement(popoverElement)
          }
        }

        if (el) {
          li.appendChild(el)
          if (renderLatex) {
            renderMathInElement(el, {
              delimiters: [
                { left: '$$', right: '$$', display: false },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: false }
              ],
              throwOnError: false
            })
          }

          li.addEventListener("mouseover", () => {
            // fix tooltip positioning
            window.FloatingUIDOM.computePosition(li, el, {
              middleware: [window.FloatingUIDOM.offset(10), window.FloatingUIDOM.inline(), window.FloatingUIDOM.shift()],
            }).then(({ x, y }) => {
              Object.assign(el.style, {
                left: `${x}px`,
                top: `${y}px`,
              })
            })

            el.classList.add("visible")
          })
          li.addEventListener("mouseout", () => {
            el.classList.remove("visible")
          })
        }
      })
  })
}
