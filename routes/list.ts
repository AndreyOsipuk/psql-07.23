import { Request, Response, NextFunction } from "express";
import { pool } from "../db";

const express = require("express");
const listRouter = express.Router();

listRouter
  .get("/", function (req: Request, res: Response) {
    pool.query("SELECT * FROM list", (error, results) => {
      if (error) {
        res.sendStatus(500);
      }
      res.status(200).json(results.rows);
    });
  })
  .post("/", function (req: Request<{}, {}, { value: string }>, res: Response) {
    const { value } = req.body;

    if (value && typeof value === "string") {
      pool.query(
        `INSERT INTO list (value, checked) VALUES ('${value}', true)`,
        (error) => {
          if (error) {
            console.log("insert error", error);
            res.status(500).send({ message: "failed" });
          }
          res.status(200).json({ message: "ok" });
        }
      );
    } else {
      res.status(400).json({ message: "value must be string" });
    }
  })
  .patch(
    "/",
    function (
      req: Request<{}, {}, { checked: boolean; id: number }>,
      res: Response
    ) {
      const { checked, id } = req.body;
      if (typeof checked === "boolean" && typeof id === "number") {
        console.log(checked, id)
        pool.query(
          `UPDATE list
            SET
              checked = ${checked}
            WHERE id = ${id};
          `,
          (error) => {
            if (error) {
              console.log("insert error", error);
              res.status(500).send({ message: "failed" });
            }
            res.status(200).json({ message: "ok" });
          }
        );
      } else {
        res.status(400).json({ message: "checked must be boolean" });
      }
    }
  )
  .delete("/", function (req: Request<{}, {}, { id: number }>, res: Response) {
    const { id } = req.body;

    if (typeof id === "number") {
      pool.query(`DELETE FROM list WHERE id = ${id};`, (error) => {
        if (error) {
          res.sendStatus(500);
        }
        res.status(200).send({ message: "ok" });
      });
    } else {
      res.status(400).json({ message: "id must be number" });
    }
  });

export default listRouter;
