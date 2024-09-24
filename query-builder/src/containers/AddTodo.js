import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addTodo } from '../actions';
import { IconXmark } from '@jotforminc/svg-icons';

const AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={e => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          dispatch(addTodo(input.value));
          input.value = '';
        }}
      >
        <input className="block text-sm w-full shadow-xs px-3 bg-white border border-navy-100 color-navy-600 radius-lg h-10" id="AddTodoInput" ref={node => { input = node; }} />
        <button
          id="AddTodoSubmit"
          type="submit"
          className="inline-flex shrink-0 items-center whitespace-nowrap gap-2 justify-center radius-lg h-10 px-4 text-sm bg-green-500 hover:bg-green-600 color-white shadow-xs"
        >
          Add Todo
          <IconXmark className="w-5" />
        </button>
      </form>
    </div>
  );
};

AddTodo.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(AddTodo);
