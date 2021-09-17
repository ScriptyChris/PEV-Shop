import React, { useState, useEffect, useReducer, useMemo } from 'react';

const translations = {
  add: 'Add',
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
};

const flexibleListReducer = (state, action) => ({
  ...state,
  [flexibleListStates[action.type]]: action.value,
});
const flexibleListStates = Object.freeze({
  ADD_BTN_VISIBILITY: 'ADD_BTN_VISIBILITY',
  EDITING_INDEX: 'EDITING_INDEX',
});

function FlexibleList({ newItemComponent, editItemComponent, emitUpdatedItemsList }) {
  if (!newItemComponent || !editItemComponent) {
    throw ReferenceError('newItemComponent, editItemComponent and renderInput must be provided!');
  }

  const EMPTY_LIST_ITEM = '';
  const [listItems, setListItems] = useState([EMPTY_LIST_ITEM]);
  const [state, dispatch] = useReducer(flexibleListReducer, {
    [flexibleListStates.ADD_BTN_VISIBILITY]: true,
    [flexibleListStates.EDITING_INDEX]: -1,
  });
  const features = useMemo(() => {
    const dispatchers = {
      showAddBtn: () => dispatch({ type: flexibleListStates.ADD_BTN_VISIBILITY, value: true }),
      hideAddBtn: () => dispatch({ type: flexibleListStates.ADD_BTN_VISIBILITY, value: false }),
      editIndex: (index) => dispatch({ type: flexibleListStates.EDITING_INDEX, value: index }),
      cancelEditing: () => dispatchers.editIndex(-1),
    };

    const resetState = () => {
      dispatchers.showAddBtn();
      dispatchers.cancelEditing();
    };

    return {
      prepareAddItem() {
        dispatchers.cancelEditing();
        dispatchers.hideAddBtn();
      },

      prepareEditItem(index) {
        dispatchers.showAddBtn();
        dispatchers.editIndex(index);
      },

      deleteItem(index) {
        setListItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
      },

      addItem(newItem) {
        setListItems((prev) => {
          const prevWithoutEmptyItem = prev.filter((newItem) => newItem !== EMPTY_LIST_ITEM);

          return [...prevWithoutEmptyItem, newItem, EMPTY_LIST_ITEM];
        });

        resetState();
      },

      editItem(newItem, index) {
        setListItems((prev) => {
          const prevWithoutEmptyItem = prev.filter((item) => item !== EMPTY_LIST_ITEM);
          prevWithoutEmptyItem.splice(index, 1, newItem);

          return [...prevWithoutEmptyItem, EMPTY_LIST_ITEM];
        });

        resetState();
      },

      resetState,
    };
  }, []);

  useEffect(() => {
    emitUpdatedItemsList(listItems);
  }, [listItems]);

  const CancelBtn = (
    <button type="button" onClick={features.resetState}>
      {translations.cancel}
    </button>
  );

  const showList = () => {
    return listItems.map((item, index) => {
      if (item === EMPTY_LIST_ITEM) {
        const addBtnVisible = state[flexibleListStates.ADD_BTN_VISIBILITY];

        return (
          <li key={item}>
            {addBtnVisible ? (
              <button type="button" onClick={features.prepareAddItem}>
                {translations.add}
              </button>
            ) : (
              <>
                {newItemComponent(features)}
                {CancelBtn}
              </>
            )}
          </li>
        );
      } else {
        const currentlyEdited = state[flexibleListStates.EDITING_INDEX] === index;

        return (
          <li key={item}>
            {currentlyEdited ? (
              <>
                {editItemComponent(item, index, features)}
                {CancelBtn}
              </>
            ) : (
              <>
                <output>{item}</output>
                <div>
                  <button type="button" onClick={() => features.prepareEditItem(index)}>
                    {translations.edit}
                  </button>
                  <button type="button" onClick={() => features.deleteItem(index)}>
                    {translations.delete}
                  </button>
                </div>
              </>
            )}
          </li>
        );
      }
    });
  };

  return <ul>{showList()}</ul>;
}

export default FlexibleList;
