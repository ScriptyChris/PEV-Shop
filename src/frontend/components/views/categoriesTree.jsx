import React, { useState, useEffect, useRef, useCallback } from 'react';
import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';

import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';

import { PEVHeading } from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import { CATEGORIES_SEPARATOR } from '@commons/consts';

const translations = Object.freeze({
  treeHeader: 'Categories',
  toggleCategoriesTree: 'Categories',
  goBackLabel: 'go back',
  categoriesSearchAriaLabel: 'Type and search',
  apply: 'Apply',
  lackOfData: 'No data!',
});

// TODO: handle selecting tree node wrapper (as "Parts") - it should auto-select all it's descendants and not consider node itself being selected
const treeRecursiveMapper = (categoryItem, index, _, level = 0) => {
  const treeLevels = ['first', 'second', 'third', 'fourth'];

  if (!treeLevels[level]) {
    throw new RangeError('Product categories hierarchy has more levels than prepared list!');
  }

  const mappedLevel = treeLevels[level];
  const key = `${mappedLevel}-level-node-${index + 1}`;

  if (categoryItem.childCategories) {
    return {
      key,
      index,
      label: categoryItem.categoryName,
      nodes: categoryItem.childCategories.map((item, idx, __) => treeRecursiveMapper(item, idx, __, level + 1)),
    };
  }

  return {
    key,
    index,
    label: categoryItem.categoryName,
  };
};

const prepareNodeFindPreSelect = (output, categoriesGroups, node) => {
  const markNodeToPreSelect = (categoriesToPreSelect, node) => {
    output.activeKey += node.key;

    if (!Array.isArray(node.nodes)) {
      return;
    }

    output.openedNodes.push(node.key);
    categoriesToPreSelect.shift();

    if (!categoriesToPreSelect.length) {
      return;
    }

    const subCategoryName = categoriesToPreSelect.shift();
    const subNode = node.nodes.find(
      (subNodeItem) => subNodeItem.label === subCategoryName || subCategoryName.includes(subNodeItem.label)
    );

    // TODO: [refactor] subcategories structure should be fixed/unified
    if (!subNode) {
      return;
    }

    output.activeKey += '/';
    markNodeToPreSelect(categoriesToPreSelect, subNode);
  };

  categoriesGroups.forEach((categories) => {
    const isMatchingGroup = categories.some((category) => node.label === category);

    if (isMatchingGroup) {
      markNodeToPreSelect(categories, node);
    }
  });
};

function useTreeMetaData({ preSelectedCategories, valueToPassToParentOnClickRef, onCategorySelect }) {
  const [treeData, setTreeData] = useState(null);
  const [treeInitials, setTreeInitials] = useState(null);
  const [autoSelectedCategory, setAutoSelectedCategory] = useState(false);
  const parsedPreSelectedCategories = preSelectedCategories.map((category) =>
    category.includes(CATEGORIES_SEPARATOR) ? category.split(CATEGORIES_SEPARATOR) : [category]
  );

  useEffect(() => {
    httpService.getProductCategories().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setTreeData(res.map(treeRecursiveMapper));
    });
  }, []);

  useEffect(() => {
    if (treeData) {
      updateTreeInitials();
    }
  }, [treeData, preSelectedCategories]);

  useEffect(() => {
    if (!treeInitials || !treeInitials.activeKey || autoSelectedCategory) {
      return;
    }

    setAutoSelectedCategory(true);

    if (!preSelectedCategories?.length) {
      return;
    }

    if (onCategorySelect) {
      onCategorySelect(preSelectedCategories);
    } else {
      valueToPassToParentOnClickRef.current = preSelectedCategories;
    }
  }, [treeInitials]);

  const updateTreeInitials = (alreadySelectedCategories) => {
    const newTreeInitials = treeData.reduce(
      (output, node) => {
        const categoriesGroups = alreadySelectedCategories?.length
          ? alreadySelectedCategories
          : parsedPreSelectedCategories;

        prepareNodeFindPreSelect(output, categoriesGroups, node);

        return output;
      },
      { activeKey: '', openedNodes: [] }
    );

    setTreeInitials(newTreeInitials);
  };

  return { treeData, treeInitials, updateTreeInitials };
}

function Tree({
  treeData,
  treeInitials,
  formField,
  isMultiselect,
  valueToPassToParentOnClickRef,
  onCategorySelect,
  updateTreeInitials,
  shouldPreselectLazily,
  preSelectedCategories,
}) {
  if (!treeData || !treeInitials) {
    return null;
  }
  const categoriesTreeRef = useRef(null);
  const categoriesTreeRefGetter = useCallback(
    (categoriesTreeNode) => {
      if (!categoriesTreeNode) {
        return;
      }

      categoriesTreeRef.current = categoriesTreeNode;

      /*
        It's workaround, because lbirary doesn't seem to support lazy initializing.
        TreeMenu likely memoizes initial active keys, so updating them later doesn't affect TreeMenu.
        Hence simulating clicks to select all needed category nodes.
      */
      if (!shouldPreselectLazily) {
        return;
      }

      const lazyClick = (nodeTarget) =>
        new Promise((resolve) => {
          const delayInMs = 75;

          setTimeout(() => {
            nodeTarget.click();
            setTimeout(resolve, delayInMs);
          }, delayInMs);
        });

      (function openNodesRecursively(categories = preSelectedCategories) {
        categoriesTreeNode
          .querySelectorAll('.rstm-tree-item:not(.rstm-tree-item--active)')
          .forEach(async (treeNode) => {
            const matchedCategory = categories.find((categoryName) =>
              categoryName.includes(treeNode.textContent.replace('+', ''))
            );

            if (!matchedCategory) {
              return;
            }

            if (matchedCategory.includes(CATEGORIES_SEPARATOR)) {
              await lazyClick(treeNode.querySelector('.rstm-toggle-icon'));
              openNodesRecursively(matchedCategory.split(CATEGORIES_SEPARATOR));
            } else {
              await lazyClick(treeNode);
            }
          });
      })();
    },
    [preSelectedCategories, shouldPreselectLazily]
  );

  const activeTreeNodes = useRef(new Map());
  const toggleActiveTreeNode = (nodeLevel, nodeIndex, matchedParentKey, nodeLabel) => {
    const currentNodeKey = `${nodeLevel}-${nodeIndex}`;
    const currentNodeValue = `${matchedParentKey}${nodeLabel}`;

    if (isMultiselect) {
      const isActiveTreeNode = activeTreeNodes.current.has(currentNodeKey);

      if (isActiveTreeNode) {
        activeTreeNodes.current.delete(currentNodeKey);
      } else {
        activeTreeNodes.current.set(currentNodeKey, currentNodeValue);
      }

      // This is a dirty workaround, because 3rd-party TreeMenu component doesn't seem to support multi selection.
      [[currentNodeKey], ...activeTreeNodes.current].forEach(([key], iteration) => {
        const isCurrentNodeKey = iteration === 0;
        const [level, index] = key.split('-');
        const treeNodeLevelSelector = `.rstm-tree-item-level${level}`;
        const treeNodeDOM = categoriesTreeRef.current.querySelectorAll(treeNodeLevelSelector)[index];

        // when some node has been folded, it's descendants won't be found by querySelector, so check for presence is needed
        if (treeNodeDOM) {
          // "Force" DOM actions execution on elements controlled by React.
          window.requestAnimationFrame(() => {
            treeNodeDOM.classList.toggle('rstm-tree-item--active', !isCurrentNodeKey);
            treeNodeDOM.setAttribute('aria-pressed', !isCurrentNodeKey);
          });
        }
      });
    } else {
      activeTreeNodes.current.clear();
      activeTreeNodes.current.set(currentNodeKey, currentNodeValue);
    }

    const activeCategoryNames = [...activeTreeNodes.current.values()];
    const outputCategoryNames = isMultiselect ? activeCategoryNames : activeCategoryNames[0];

    if (onCategorySelect) {
      onCategorySelect(outputCategoryNames);
    } else {
      valueToPassToParentOnClickRef.current = outputCategoryNames;
    }

    if (isMultiselect) {
      updateTreeInitials([activeCategoryNames]);
    }
  };
  toggleActiveTreeNode.matchParentKey = (treeData, clickedItem) => {
    const matchedParent = treeData.find((node) => clickedItem.parent && clickedItem.parent === node.key);
    return matchedParent ? `${matchedParent.label}${CATEGORIES_SEPARATOR}` : '';
  };

  // TODO: [refactor] dirty workaround to show already selected nodes (unfortunately, except nested ones)
  useEffect(() => {
    if (activeTreeNodes.current.size > 1 || categoriesTreeRef.current) {
      return;
    }

    const firstActiveTreeNode = categoriesTreeRef.current.querySelector('.rstm-tree-item--active');

    if (!firstActiveTreeNode) {
      return;
    }
    // click twice to "toggle" the first active node, which will automatically activate remaining ones
    window.setTimeout(() => {
      firstActiveTreeNode.click();

      window.setTimeout(() => {
        firstActiveTreeNode.click();
      });
    });
  }, []);

  const searchCategories =
    (search) =>
    ({ target: { value } }) =>
      search(value);

  return (
    /*
      Attribute [ref] is used on whole component wrapper, because
      both useRef() hook and React.createRef() method don't seem to
      give reference to nested functional component's DOM elements, such as used TreeMenu.
    */
    <div ref={categoriesTreeRefGetter} className="categories-tree">
      {formField}

      <TreeMenu
        data={treeData}
        onClickItem={(clickedItem) =>
          toggleActiveTreeNode(
            clickedItem.level,
            clickedItem.index,
            toggleActiveTreeNode.matchParentKey(treeData, clickedItem),
            clickedItem.label
          )
        }
        initialActiveKey={treeInitials.activeKey}
        initialOpenNodes={treeInitials.openedNodes}
      >
        {({ search, items }) => (
          <>
            <TextField
              className="rstm-search"
              type="search"
              onChange={searchCategories(search)}
              aria-label={translations.categoriesSearchAriaLabel}
              placeholder={translations.categoriesSearchAriaLabel}
            />

            <List className="rstm-tree-item-group" data-cy="list:categories_names">
              {items.map((props) => (
                // TODO: [UX] use MUI here. That would probably require to get rid of whole react-simple-tree-menu module in favor of MUI's <TreeView /> component
                <ItemComponent key={props.key} {...props} />
              ))}
            </List>
          </>
        )}
      </TreeMenu>
    </div>
  );
}

export default function CategoriesTree({
  preSelectedCategories = [],
  shouldPreselectLazily = false,
  onCategorySelect,
  isMultiselect,
  formField,
  filtersCommonChildrenAPI,
}) {
  if (!Array.isArray(preSelectedCategories)) {
    throw TypeError(`preSelectedCategories has to be an array! Received: "${preSelectedCategories}".`);
  } else if (onCategorySelect && typeof onCategorySelect !== 'function') {
    throw TypeError(`onCategorySelect should be a function! Received: "${onCategorySelect}".`);
  } else if (filtersCommonChildrenAPI && onCategorySelect) {
    throw Error(
      `Only either of filtersCommonChildrenAPI or onCategorySelect must be provided! 
      Received: "${filtersCommonChildrenAPI}" and "${onCategorySelect}".`
    );
  }

  const valueToPassToParentOnClickRef = useRef(preSelectedCategories);
  const { treeData, treeInitials, updateTreeInitials } = useTreeMetaData({
    preSelectedCategories,
    valueToPassToParentOnClickRef,
    onCategorySelect,
  });

  if (!treeData) {
    return translations.lackOfData;
  }

  filtersCommonChildrenAPI?.tryUpdatingFiltersCycleData(
    filtersCommonChildrenAPI?.filterNamesMap.productCategories,
    valueToPassToParentOnClickRef.current
  );

  return (
    <section className="pev-flex pev-flex--columned">
      {filtersCommonChildrenAPI && (
        <PEVHeading level={3} className="categories-tree-heading">
          {translations.treeHeader}
        </PEVHeading>
      )}
      <Tree
        {...{
          treeData,
          treeInitials,
          formField,
          isMultiselect,
          valueToPassToParentOnClickRef,
          updateTreeInitials,
          shouldPreselectLazily,
          preSelectedCategories,
          onCategorySelect,
        }}
      />
    </section>
  );
}

export function CategoriesTreeFormField({ onCategorySelect, ...props }) {
  const handleCategorySelect = (categoryNames) => {
    props.form.setFieldValue(props.field.name, categoryNames.toString());
    onCategorySelect(categoryNames.toString());
  };

  return (
    <CategoriesTree
      {...props}
      onCategorySelect={handleCategorySelect}
      formField={
        <input
          type="text"
          {...props.field}
          className="categories-tree-form-field__proxy-input--hidden"
          data-cy="input:category_names"
          required
        />
      }
    />
  );
}
