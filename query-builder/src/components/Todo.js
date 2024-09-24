import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ onClick, completed, text }) => (
  <li
    className="p-2 cursor-pointer hover:bg-gray-25"
    onClick={onClick}
    onKeyUp={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none'
    }}
    role="menuitem"
  >
    {text}
  </li>
);

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

export default Todo;
