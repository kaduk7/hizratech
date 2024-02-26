"use client"
import React, { useState } from 'react';


const MySelectComponent = () => {

  return (
    <div>
      <label htmlFor="id_label_single">
        Click this to highlight the single select element

        <select className="js-example-basic-single js-states form-control" id="id_label_single">
          <option>a</option>
          <option>b</option>
          <option>c</option>
        </select>
      </label>

      <label htmlFor="id_label_multiple">
        Click this to highlight the multiple select element

        <select className="js-example-basic-multiple js-states form-control" id="id_label_multiple" multiple>
        <option>a</option>
          <option>b</option>
          <option>c</option>
        </select>
      </label>
    </div>
  );
};

export default MySelectComponent;