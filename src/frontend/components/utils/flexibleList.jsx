import React, { useState, useEffect, useReducer, useMemo } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

const translations = {
  add: 'Add',
  confirm: 'Confirm',
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
};

const flexibleListStates = Object.freeze({
  ADD_BTN_VISIBILITY: 'ADD_BTN_VISIBILITY',
  EDITING_INDEX: 'EDITING_INDEX',
});
const flexibleListReducer = (state, action) => ({
  ...state,
  [flexibleListStates[action.type]]: action.value,
});

function FlexibleList({ initialListItems = [], NewItemComponent, EditItemComponent, emitUpdatedItemsList }) {
  if (!NewItemComponent || !EditItemComponent) {
    throw ReferenceError('NewItemComponent and EditItemComponent must be provided!');
  }

  const EMPTY_LIST_ITEM = '';
  const [listItems, setListItems] = useState(() =>
    initialListItems.length ? initialListItems.concat(EMPTY_LIST_ITEM) : [EMPTY_LIST_ITEM]
  );
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

  const updateItem = ({ updateValue, isEditMode, editedIndex }) => {
    if (isEditMode) {
      features.editItem(updateValue, editedIndex);
    } else {
      features.addItem(updateValue);
    }
  };

  const getConfirmAndCancelButtons = ({ inputItemRef = {}, onConfirmBtnClick, isConfirmBtnDisabled } = {}) => (
    <div className="flexible-list__item-btns">
      {inputItemRef.current && (
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={onConfirmBtnClick}
          disabled={isConfirmBtnDisabled}
        >
          {translations.confirm}
        </Button>
      )}
      <Button variant="outlined" size="small" type="button" onClick={features.resetState}>
        {translations.cancel}
      </Button>
    </div>
  );

  return (
    // TODO: [UX] add manipulating list order via drag&drop
    <List className="flexible-list" disablePadding>
      {listItems.map((item, index) => {
        if (item === EMPTY_LIST_ITEM) {
          const addBtnVisible = state[flexibleListStates.ADD_BTN_VISIBILITY];

          return (
            <ListItem className="flexible-list__item" key={item}>
              {addBtnVisible ? (
                <Button
                  className="flexible-list__item-add-btn"
                  variant="outlined"
                  size="small"
                  type="button"
                  onClick={features.prepareAddItem}
                >
                  {translations.add}
                </Button>
              ) : (
                <NewItemComponent listFeatures={features} updateItem={updateItem}>
                  {getConfirmAndCancelButtons}
                </NewItemComponent>
              )}
            </ListItem>
          );
        } else {
          const currentlyEdited = state[flexibleListStates.EDITING_INDEX] === index;

          return (
            <ListItem className="flexible-list__item" key={item}>
              {currentlyEdited ? (
                <EditItemComponent item={item} editedIndex={index} listFeatures={features} updateItem={updateItem}>
                  {getConfirmAndCancelButtons}
                </EditItemComponent>
              ) : (
                <>
                  <output>{item}</output>
                  <div className="flexible-list__item-btns">
                    <Button
                      variant="outlined"
                      size="small"
                      type="button"
                      onClick={() => features.prepareEditItem(index)}
                    >
                      {translations.edit}
                    </Button>
                    <Button variant="outlined" size="small" type="button" onClick={() => features.deleteItem(index)}>
                      {translations.delete}
                    </Button>
                  </div>
                </>
              )}
            </ListItem>
          );
        }
      })}
    </List>
  );
}

export default FlexibleList;
