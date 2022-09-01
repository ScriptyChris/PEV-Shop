import React, { useState, useEffect, useReducer, useMemo } from 'react';
import classNames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputLabel from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { PEVIconButton } from '@frontend/components/utils/pevElements';

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

function FlexibleList({
  initialListItems = [],
  NewItemComponent,
  EditItemComponent,
  emitUpdatedItemsList,
  itemsContextName,
}) {
  if (!NewItemComponent || !EditItemComponent) {
    throw ReferenceError('NewItemComponent and EditItemComponent must be provided!');
  } else if (!itemsContextName || typeof itemsContextName !== 'string') {
    throw ReferenceError(`itemsContextName must be provided as string! Received: "${itemsContextName}"`);
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
    <>
      {inputItemRef.current && (
        <PEVIconButton
          className="MuiButton-outlined"
          type="button"
          a11y={translations.confirm}
          onClick={onConfirmBtnClick}
          disabled={isConfirmBtnDisabled}
        >
          <DoneIcon />
        </PEVIconButton>
      )}

      <PEVIconButton
        className="MuiButton-outlined"
        type="button"
        a11y={translations.cancel}
        onClick={features.resetState}
      >
        <CloseIcon />
      </PEVIconButton>
    </>
  );

  return (
    // TODO: [UX] add manipulating list order via drag&drop
    <List className="flexible-list" disablePadding>
      {listItems.map((item, index) => {
        if (item === EMPTY_LIST_ITEM) {
          const addBtnVisible = state[flexibleListStates.ADD_BTN_VISIBILITY];

          return (
            <ListItem
              className={classNames('flexible-list__item', {
                'flexible-list__item--is-add-btn': addBtnVisible,
                'flexible-list__item--is-editable': !addBtnVisible,
              })}
              key={item}
            >
              {addBtnVisible ? (
                <PEVIconButton
                  className="flexible-list__item-add-btn"
                  type="button"
                  a11y={translations.add}
                  onClick={features.prepareAddItem}
                >
                  <AddIcon fontSize="large" />
                </PEVIconButton>
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
            <ListItem
              className={classNames('flexible-list__item', { 'flexible-list__item--is-editable': currentlyEdited })}
              key={item}
            >
              {currentlyEdited ? (
                <EditItemComponent item={item} editedIndex={index} listFeatures={features} updateItem={updateItem}>
                  {getConfirmAndCancelButtons}
                </EditItemComponent>
              ) : (
                <>
                  <InputLabel component="output" data-cy={`label:${itemsContextName}__${index}`}>
                    {item}
                  </InputLabel>
                  <div className="flexible-list__item-btns">
                    <PEVIconButton
                      type="button"
                      a11y={translations.edit}
                      onClick={() => features.prepareEditItem(index)}
                    >
                      <EditIcon />
                    </PEVIconButton>
                    <PEVIconButton type="button" a11y={translations.delete} onClick={() => features.deleteItem(index)}>
                      <DeleteIcon />
                    </PEVIconButton>
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
