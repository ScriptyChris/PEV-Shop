import React, { useState, useEffect, createRef, useRef } from 'react';
import apiService from '../../features/apiService';
import TreeMenu from 'react-simple-tree-menu';

export default function CategoriesTree(props) {
  const [categoriesMap, setCategoriesMap] = useState(null);
  const categoriesTreeRef = createRef();
  const treeMenuRef = createRef();
  const activeTreeNodes = useRef(new Map());

  useEffect(() => {
    (async () => {
      const productCategories = await apiService.getProductCategories();

      setCategoriesMap(productCategories);
    })();
  }, []);

  const getCategoriesTree = () => {
    if (categoriesMap) {
      const treeData = categoriesMap.map(getCategoriesTree.recursiveMapper);

      return (
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
          ref={treeMenuRef}
        />
      );
    }

    return null;
  };
  getCategoriesTree.levels = ['first', 'second', 'third', 'fourth'];
  // TODO: handle selecting tree node wrapper (as "Parts") - it should auto-select all it's descendants and not consider node itself being selected
  getCategoriesTree.recursiveMapper = (categoryItem, index, _, level = 0) => {
    if (!getCategoriesTree.levels[level]) {
      throw new RangeError('Product categories hierarchy has more levels than prepared list!');
    }

    const isNestedCategory = typeof categoryItem === 'object';
    const mappedLevel = getCategoriesTree.levels[level];
    const key = `${mappedLevel}-level-node-${index + 1}`;

    if (isNestedCategory) {
      return {
        key,
        index,
        label: categoryItem.parentCategory,
        nodes: categoryItem.childCategories.map((item, idx, __) =>
          getCategoriesTree.recursiveMapper(item, idx, __, level + 1)
        ),
      };
    }

    return {
      key,
      index,
      label: categoryItem,
    };
  };

  const toggleActiveTreeNode = (nodeLevel, nodeIndex, matchedParentKey, nodeLabel) => {
    const currentNodeKey = `${nodeLevel}-${nodeIndex}`;
    const isActiveTreeNode = activeTreeNodes.current.has(currentNodeKey);

    if (isActiveTreeNode) {
      activeTreeNodes.current.delete(currentNodeKey);
    } else {
      activeTreeNodes.current.set(currentNodeKey, `${matchedParentKey}${nodeLabel}`);
    }

    // This is a dirty workaround, because 3rd-party TreeMenu component doesn't seem to support multi selection.
    [[currentNodeKey], ...activeTreeNodes.current].forEach(([key], iteration) => {
      const isCurrentNodeKey = iteration === 0;
      const [level, index] = key.split('-');
      const treeNodeLevelSelector = `.rstm-tree-item-level${level}`;

      const treeNodeDOM = categoriesTreeRef.current.querySelectorAll(treeNodeLevelSelector)[index];

      // "Force" DOM actions execution on elements controlled by React.
      requestAnimationFrame(() => {
        treeNodeDOM.classList.toggle('rstm-tree-item--active', !isCurrentNodeKey);
        treeNodeDOM.setAttribute('aria-pressed', !isCurrentNodeKey);
      });
    });

    const activeCategoryNames = [...activeTreeNodes.current.values()];
    props.onCategorySelect(activeCategoryNames);
  };
  toggleActiveTreeNode.matchParentKey = (treeData, clickedItem) => {
    const matchedParent = treeData.find((node) => clickedItem.parent && clickedItem.parent === node.key);
    return matchedParent ? `${matchedParent.label}|` : '';
  };

  return (
    /*
      Attribute [ref] is used on whole component wrapper, because
      both useRef() hook and React.createRef() method don't seem to
      give reference to nested functional component's DOM elements, such as used TreeMenu.
    */
    <div ref={categoriesTreeRef}>{getCategoriesTree()}</div>
  );
}
