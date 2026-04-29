(() => {
  const els = {
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    deadline: document.getElementById("deadline"),
    now: document.getElementById("now"),
    tz: document.getElementById("tz"),
    year: document.getElementById("year"),
  };

  const pad = (n) => String(n).padStart(2, "0");

  const getDeadline = () => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d;
  };

  const fmtDateTime = (d) =>
    d.toLocaleString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const fmtDate = (d) =>
    d.toLocaleString(undefined, {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const setValue = (el, next) => {
    if (el.textContent !== next) {
      el.textContent = next;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    }
  };

  let deadline = getDeadline();
  els.deadline.textContent = fmtDate(deadline);
  els.tz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  els.year.textContent = String(new Date().getFullYear());

  const tick = () => {
    const now = new Date();

    if (now >= deadline) {
      deadline = getDeadline();
      els.deadline.textContent = fmtDate(deadline);
    }

    const diff = Math.max(0, deadline.getTime() - now.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setValue(els.hours, pad(hours));
    setValue(els.minutes, pad(minutes));
    setValue(els.seconds, pad(seconds));
    els.now.textContent = fmtDateTime(now);

    document.body.classList.toggle(
      "urgent",
      totalSeconds <= 3600 && totalSeconds > 600,
    );
    document.body.classList.toggle("critical", totalSeconds <= 600);

    document.title =
      totalSeconds > 0
        ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)} · Webout signing`
        : "Webout · Investment signed";
  };

  tick();
  setInterval(tick, 1000);
})();
