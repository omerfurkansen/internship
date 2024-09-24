import React from 'react';
import FilterLink from '../containers/FilterLink';
import { VisibilityFilters } from '../actions';

const Footer = () => (
  <div className="flex justify-between items-center">
    <span>Show: </span>
    <span className="flex gap-2">
      <FilterLink filter={VisibilityFilters.SHOW_ALL} className="p-2 bg-gray-50">
        All
      </FilterLink>
      <FilterLink filter={VisibilityFilters.SHOW_ACTIVE} className="p-2 bg-gray-50">
        Active
      </FilterLink>
      <FilterLink filter={VisibilityFilters.SHOW_COMPLETED} className="p-2 bg-gray-50">
        Completed
      </FilterLink>
    </span>
  </div>
);

export default Footer;
