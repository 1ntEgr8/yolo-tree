class YoloTree extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const leaves = this.querySelectorAll("li");
    const subtrees = this.querySelectorAll("ul");

    for (const subtree of subtrees) {
      subtree.classList.add("hide");
    }

    for (const leaf of leaves) {
      const subtree = leaf.querySelector("ul");
      if (subtree !== null) {
        leaf.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          subtree.classList.toggle("hide");
        });
      }
    }
  }
}

customElements.define("yolo-tree", YoloTree);

const app = document.getElementById("app");

async function fetchLinks() {
  const result = await fetch("./links.json");
  const data = await result.json();
  return data;
}

function makeLink(txt, href) {
  const anchor = document.createElement("a");
  anchor.innerHTML = txt;
  anchor.href = href;
  anchor.target = "_blank";
  return anchor;
}

function makeIcon(txt, src) {
  const icon = document.createElement("img"); 
  icon.src = src;
  icon.alt = txt;
  icon.classList.add("icon");
  return icon;
}

function buildTree(links, yolo = true) {
  let tag;
  if (yolo) {
    tag = "yolo-tree";
  } else {
    tag = "ul";
  }
  const tree = document.createElement(tag);
  for (const key in links) {
    if (key === "icon") continue;
    const leaf = document.createElement("li");
    const value = links[key];
    if (typeof value === "object") {
      if (value.link) {
        leaf.appendChild(makeLink(key, value.link));
        if (value.icon) {
          leaf.appendChild(makeIcon(key, value.icon));
        }
      } else {
        leaf.innerHTML = key;
        leaf.classList.add("plump");
        const subtree = buildTree(links[key], false);
        leaf.appendChild(subtree);
        if (value.icon) {
          leaf.appendChild(makeIcon(key, value.icon));
        }
      }
    } else {
      leaf.appendChild(makeLink(key, value));
    }
    tree.appendChild(leaf);
  }
  return tree;
}

(async () => {
  const links = await fetchLinks();
  const tree = buildTree(links);
  const app = document.getElementById("app");
  app.appendChild(tree);
})();
