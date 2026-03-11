.bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1.5px solid transparent;
  background: #fff;
}

.card.blue   { border-color: #bfdbfe; background: #eff6ff; }
.card.green  { border-color: #bbf7d0; background: #f0fdf4; }
.card.amber  { border-color: #fde68a; background: #fffbeb; }

.value {
  font-family: "DM Mono", monospace;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.card.blue  .value { color: #1d4ed8; }
.card.green .value { color: #15803d; }
.card.amber .value { color: #92400e; }

.label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #94a3b8;
}
