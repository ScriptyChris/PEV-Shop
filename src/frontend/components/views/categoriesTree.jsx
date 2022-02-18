import React, { useState, useEffect, useCallback, createRef, useRef } from 'react';
import httpService from '@frontend/features/httpService';
import TreeMenu from 'react-simple-tree-menu';

const CATEGORIES_SEPARATOR = '|';

function CategoriesTree({ preSelectedCategory = '', onCategorySelect, isMultiselect, formField }) {
  const parsedPreSelectedCategory = preSelectedCategory.split(CATEGORIES_SEPARATOR);
  const [categoriesMap, setCategoriesMap] = useState(null);
  const [autoSelectedCategory, setAutoSelectedCategory] = useState(false);
  const categoriesTreeRef = createRef();
  const activeTreeNodes = useRef(new Map());
  const findNodeToPreSelect = useCallback(function _findNodeToPreSelect(output, processedPreSelectedCategory, node) {
    output.activeKey += node.key;

    if (Array.isArray(node.nodes)) {
      output.openedNodes.push(node.key);
      processedPreSelectedCategory.shift();

      if (processedPreSelectedCategory.length) {
        const subCategoryName = processedPreSelectedCategory.shift();
        const subNode = node.nodes.find((subNodeItem) => subNodeItem.label === subCategoryName);

        output.activeKey += '/';
        _findNodeToPreSelect(output, processedPreSelectedCategory, subNode);
      }
    }
  }, []);

  useEffect(() => {
    httpService.getProductCategories().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setCategoriesMap(res);
    });
  }, []);

  useEffect(() => {
    if (autoSelectedCategory) {
      onCategorySelect(preSelectedCategory);
    }
  }, [autoSelectedCategory]);

  const getCategoriesTree = () => {
    if (!categoriesMap) {
      return;
    }

    const treeData = categoriesMap.map(getCategoriesTree.recursiveMapper);
    const initials = treeData.reduce(
      (output, node) => {
        if (node.label === parsedPreSelectedCategory[0]) {
          findNodeToPreSelect(output, [...parsedPreSelectedCategory], node);
        }

        return output;
      },
      { activeKey: '', openedNodes: [] }
    );

    if (initials.activeKey && !autoSelectedCategory) {
      setAutoSelectedCategory(true);
    }

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
        initialActiveKey={initials.activeKey}
        initialOpenNodes={initials.openedNodes}
      />
    );
  };
  getCategoriesTree.levels = ['first', 'second', 'third', 'fourth'];
  // TODO: handle selecting tree node wrapper (as "Parts") - it should auto-select all it's descendants and not consider node itself being selected
  getCategoriesTree.recursiveMapper = (categoryItem, index, _, level = 0) => {
    if (!getCategoriesTree.levels[level]) {
      throw new RangeError('Product categories hierarchy has more levels than prepared list!');
    }

    const mappedLevel = getCategoriesTree.levels[level];
    const key = `${mappedLevel}-level-node-${index + 1}`;

    if (categoryItem.childCategories) {
      return {
        key,
        index,
        label: categoryItem.categoryName,
        nodes: categoryItem.childCategories.map((item, idx, __) =>
          getCategoriesTree.recursiveMapper(item, idx, __, level + 1)
        ),
      };
    }

    return {
      key,
      index,
      label: categoryItem.categoryName,
    };
  };

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

        // "Force" DOM actions execution on elements controlled by React.
        requestAnimationFrame(() => {
          treeNodeDOM.classList.toggle('rstm-tree-item--active', !isCurrentNodeKey);
          treeNodeDOM.setAttribute('aria-pressed', !isCurrentNodeKey);
        });
      });
    } else {
      activeTreeNodes.current.clear();
      activeTreeNodes.current.set(currentNodeKey, currentNodeValue);
    }

    const activeCategoryNames = [...activeTreeNodes.current.values()];
    onCategorySelect(isMultiselect ? activeCategoryNames : activeCategoryNames[0]);
  };
  toggleActiveTreeNode.matchParentKey = (treeData, clickedItem) => {
    const matchedParent = treeData.find((node) => clickedItem.parent && clickedItem.parent === node.key);
    return matchedParent ? `${matchedParent.label}${CATEGORIES_SEPARATOR}` : '';
  };

  return (
    /*
      Attribute [ref] is used on whole component wrapper, because
      both useRef() hook and React.createRef() method don't seem to
      give reference to nested functional component's DOM elements, such as used TreeMenu.
    */
    <div ref={categoriesTreeRef}>
      {formField}
      {getCategoriesTree()}
    </div>
  );
}

function CategoriesTreeFormField({ onCategorySelect, ...props }) {
  const handleCategorySelect = (categoryNames) => {
    props.form.setFieldValue(props.field.name, categoryNames.toString());
    onCategorySelect(categoryNames.toString());
  };

  return (
    <CategoriesTree
      {...props}
      onCategorySelect={handleCategorySelect}
      formField={
        <input type="text" {...props.field} className="categories-tree-form-field__proxy-input--hidden" required />
      }
    />
  );
}

export { CategoriesTree as default, CategoriesTreeFormField };
