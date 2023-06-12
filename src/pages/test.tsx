import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { colourOptions } from '../lib/color/color';

export default function MultiSelectSort() {
  return (
    <CreatableSelect isMulti options={colourOptions} />
  );
}
