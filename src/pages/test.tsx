import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { colourOptions } from '../lib/color/color';

export default function MultiSelectSort() {
  return (
    // <CreatableSelect isMulti options={colourOptions} />
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
          </tr>
          <tr>
            <th>Name</th>
          </tr>
          <tr>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
          </tr>
          <tr>Wunna</tr>
          <tr>wunna@gmail.com</tr>

          <tr>
            <td>1</td>
          </tr>
          <tr>Wunna</tr>
          <tr>wunna@gmail.com</tr>
        </tbody>
      </table>
    </div>
  );
}
