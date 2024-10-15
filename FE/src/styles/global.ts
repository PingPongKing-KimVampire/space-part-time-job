const Button = {
  fontSize: "24px",
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  position: "relative",
};

export const activatedButton = {
  background: "#4361EE",
  color: "white",
  ...Button,
};

export const inactivatedButton = {
  background: "#EDEDED",
  color: "#B0B0B0",
  ...Button,
};
