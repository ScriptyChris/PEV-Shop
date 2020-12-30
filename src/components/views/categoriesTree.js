import React, { useState, useEffect, createRef } from 'react';
import apiService from '../../features/apiService';
import TreeMenu from 'react-simple-tree-menu';

export default function CategoriesTree() {
  const [categoriesMap, setCategoriesMap] = useState(null);
  const categoriesTreeRef = createRef();
  const treeMenuRef = createRef();
  const activeTreeNodes = new Map();

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
          onClickItem={(clickedItem) => {
            // console.log('clickedItem:', clickedItem);

            toggleActiveTreeNode(clickedItem.level, clickedItem.index, clickedItem.label);
          }}
          ref={treeMenuRef}
        />
      );
    }

    return null;
  };
  getCategoriesTree.levels = ['first', 'second', 'third', 'fourth'];
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

  const toggleActiveTreeNode = (nodeLevel, nodeIndex, nodeLabel) => {
    const currentNodeKey = `${nodeLevel}-${nodeIndex}`;
    const isActiveTreeNode /*activeTreeNodeIndex*/ = activeTreeNodes.has(currentNodeKey); //.findIndex(({ level, index }) => level === nodeLevel && index === nodeIndex);

    if (isActiveTreeNode /*activeTreeNodeIndex*/ /* > -1*/) {
      activeTreeNodes.delete(currentNodeKey); //.splice(activeTreeNodeIndex, 1);
    } else {
      activeTreeNodes.set(currentNodeKey, { nodeLevel, nodeIndex, nodeLabel }); //.push({ nodeLevel, nodeIndex, nodeLabel });
    }

    // This is a dirty workaround, because 3rd-party TreeMenu component doesn't seem to support multi selection.
    activeTreeNodes.forEach((label, key) => {
      const [level, index] = key.split('-');
      const treeNodeLevelSelector = `.rstm-tree-item-level${level}`;
      const treeNodeDOM = categoriesTreeRef.current.querySelectorAll(treeNodeLevelSelector)[index];

      // "Force" DOM actions execution on elements controlled by React.
      requestAnimationFrame(() => {
        treeNodeDOM.classList.add('rstm-tree-item--active');
        treeNodeDOM.setAttribute('aria-pressed', true);

        // console.log('treeNodeDOM:', treeNodeDOM, ' /classList:', treeNodeDOM.classList);
      });
    });

    // treeMenuRef.current.updater.enqueueSetState(treeMenuRef.current, { activeKey: '' }, (...args) => {
    //   console.log('[updated state] args:', args);
    //
    //   treeMenuRef.current.updater.enqueueForceUpdate(treeMenuRef.current, (...args) =>
    //     console.log('[rerendered] args:', args)
    //   );
    // });

    console.warn('activeTreeNodes:', [...activeTreeNodes], ' /treeMenuRef:', treeMenuRef.current);
  };

  return (
    /*
      Attribute [ref] is used on whole component wrapper, because
      both useRef() hook and React.createRef() method don't seem to
      give reference to nested functional component's DOM elements, such as used TreeMenu.
    */
    <div ref={categoriesTreeRef}>
      [Categories Tree...]
      {getCategoriesTree()}
    </div>
  );
}
