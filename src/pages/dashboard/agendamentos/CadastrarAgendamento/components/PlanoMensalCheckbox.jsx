import React from "react";
import Checkbox from "../../../components/Checkbox/Checkbox.jsx";

const PlanoMensalCheckbox = ({ checked, onChange }) => (
  <Checkbox
    labelTitle="Plano mensal ativo?"
    onChange={onChange}
    checked={checked}
  />
);

export default PlanoMensalCheckbox;
