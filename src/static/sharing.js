export function createActivitySharing(name) {
  const activityUrl = new URL("index.html", window.location.href);
  activityUrl.search = "";
  activityUrl.hash = "";
  activityUrl.searchParams.set("activity", name);
  const url = activityUrl.href;
  const text = `Check out ${name} at Mergington High School!`;

  const sharing = document.createElement("div");
  sharing.className = "activity-sharing";
  sharing.setAttribute("role", "group");
  sharing.setAttribute("aria-label", `Share ${name}`);

  const label = document.createElement("span");
  label.className = "share-label";
  label.textContent = "Share activity:";
  sharing.appendChild(label);

  const facebook = new URL("https://www.facebook.com/sharer/sharer.php");
  facebook.searchParams.set("u", url);
  const x = new URL("https://twitter.com/intent/tweet");
  x.searchParams.set("text", text);
  x.searchParams.set("url", url);
  const email = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n${url}`)}`;

  [
    ["Facebook", facebook.href],
    ["X", x.href],
    ["Email", email],
  ].forEach(([label, href]) => {
    const link = document.createElement("a");
    link.className = "share-link";
    link.textContent = label;
    link.href = href;
    link.setAttribute("aria-label", `Share ${name} via ${label}`);
    if (label !== "Email") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Share ${name} via ${label} (opens in a new tab)`);
    }
    sharing.appendChild(link);
  });

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy link";
  copyButton.setAttribute("aria-label", `Copy link to ${name}`);
  sharing.appendChild(copyButton);

  const manualCopy = document.createElement("input");
  manualCopy.type = "text";
  manualCopy.readOnly = true;
  manualCopy.value = url;
  manualCopy.hidden = true;
  manualCopy.setAttribute("aria-label", `Link to ${name}, copy this link manually`);
  sharing.appendChild(manualCopy);

  const status = document.createElement("span");
  status.className = "share-status";
  status.setAttribute("role", "status");
  sharing.appendChild(status);

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      manualCopy.hidden = true;
      status.textContent = "Link copied!";
    } catch {
      manualCopy.hidden = false;
      manualCopy.focus();
      manualCopy.select();
      status.textContent = "Select and copy the link above to share it.";
    }
  });

  return sharing;
}
