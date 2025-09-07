import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token" });

  const token = authHeader.split(" ")[1]; // <-- get token after 'Bearer'

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    req.user = jwt.verify(token, "secret_key");
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};
