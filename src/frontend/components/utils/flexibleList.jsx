/**
 * Flexible list component, which allows adding, editing and deleting it's items in a customizable way.
 * @module
 */

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
  searchForItem: 'search for...?',
};

const flexibleListStates = Object.freeze({
  ADD_BTN_VISIBILITY: 'ADD_BTN_VISIBILITY',
  EDITING_INDEX: 'EDITING_INDEX',
});
const flexibleListReducer = (state, action) => ({
  ...state,
  [flexibleListStates[action.type]]: action.value,
});

const getConfirmAndCancelButtons = (itemsContextName, features, indexOrNew = 'new') => {
  return function ConfirmAndCancelButtons({ inputItemRef = {}, onConfirmBtnClick, isConfirmBtnDisabled } = {}) {
    return (
      <>
        {inputItemRef.current && (
          <PEVIconButton
            className="MuiButton-outlined"
            type="button"
            a11y={translations.confirm}
            onClick={onConfirmBtnClick}
            disabled={isConfirmBtnDisabled}
            data-cy={`button:${itemsContextName}__confirm-${indexOrNew}`}
          >
            <DoneIcon />
          </PEVIconButton>
        )}

        <PEVIconButton
          className="MuiButton-outlined"
          type="button"
          a11y={translations.cancel}
          onClick={features.resetState}
          data-cy={`button:${itemsContextName}__cancel-${indexOrNew}`}
        >
          <CloseIcon />
        </PEVIconButton>
      </>
    );
  };
};

const EMPTY_LIST_ITEM = '';
const filterOutEmptyItemFromList = (prev) => prev.filter((prevItem) => prevItem !== EMPTY_LIST_ITEM);

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

  const [listItems, setListItems] = useState(initialListItems.length ? initialListItems : []);
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
      setListItems(filterOutEmptyItemFromList);
    };

    return {
      prepareAddItem() {
        dispatchers.cancelEditing();
        dispatchers.hideAddBtn();
        setListItems((prev) => [...prev, EMPTY_LIST_ITEM]);
      },

      prepareEditItem(index) {
        dispatchers.showAddBtn();
        dispatchers.editIndex(index);
        setListItems(filterOutEmptyItemFromList);
      },

      deleteItem(index) {
        setListItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
      },

      addItem(newItem) {
        setListItems((prev) => [...filterOutEmptyItemFromList(prev), newItem]);
        resetState();
      },

      editItem(newItem, index) {
        setListItems((prev) => {
          prev.splice(index, 1, newItem);

          return prev;
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

  const addBtnVisible = state[flexibleListStates.ADD_BTN_VISIBILITY];

  // TODO: [UX] add manipulating list order via drag&drop
  return (
    <div className="pev-flex pev-flex--columned flexible-list-container">
      <List className="flexible-list" disablePadding data-cy={`list:${itemsContextName}`}>
        {listItems
          .map((item, index) => {
            const isCurrentlyEdited = state[flexibleListStates.EDITING_INDEX] === index;

            if (item === EMPTY_LIST_ITEM) {
              return (
                <ListItem className="flexible-list__item flexible-list__item--is-editable" key={item}>
                  <NewItemComponent listFeatures={features} updateItem={updateItem} label={translations.searchForItem}>
                    {getConfirmAndCancelButtons(itemsContextName, features)}
                  </NewItemComponent>
                </ListItem>
              );
            } else {
              return (
                <ListItem
                  className={classNames('flexible-list__item', {
                    'flexible-list__item--is-editable': isCurrentlyEdited,
                  })}
                  key={item}
                >
                  {isCurrentlyEdited ? (
                    <EditItemComponent
                      item={item}
                      editedIndex={index}
                      listFeatures={features}
                      updateItem={updateItem}
                      label={translations.searchForItem}
                    >
                      {getConfirmAndCancelButtons(itemsContextName, features, index)}
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
                          data-cy={`button:${itemsContextName}__edit-${index}`}
                        >
                          <EditIcon />
                        </PEVIconButton>
                        <PEVIconButton
                          type="button"
                          a11y={translations.delete}
                          onClick={() => features.deleteItem(index)}
                          data-cy={`button:${itemsContextName}__delete-${index}`}
                        >
                          <DeleteIcon />
                        </PEVIconButton>
                      </div>
                    </>
                  )}
                </ListItem>
              );
            }
          })
          .filter(Boolean)}
      </List>

      {addBtnVisible && (
        <PEVIconButton
          className="flexible-list__item-add-btn"
          type="button"
          a11y={translations.add}
          onClick={features.prepareAddItem}
          data-cy={`button:${itemsContextName}__add-new`}
        >
          <AddIcon fontSize="large" />
        </PEVIconButton>
      )}
    </div>
  );
}

export default FlexibleList;
