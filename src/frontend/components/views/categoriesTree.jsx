import React, { useState, useEffect, useRef } from 'react';
import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';
import classNames from 'classnames';

import Drawer from '@material-ui/core/Drawer';
import AccountTree from '@material-ui/icons/AccountTree';
import ArrowBack from '@material-ui/icons/ArrowBack';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';

import { PEVIconButton, PEVHeading } from '@frontend/components/utils/pevElements';
import httpService from '@frontend/features/httpService';
import { useMobileLayout } from '@frontend/contexts/mobile-layout';

const translations = Object.freeze({
  treeHeader: 'Categories',
  toggleCategoriesTree: 'Categories',
  goBackLabel: 'go back',
  categoriesSearchAriaLabel: 'Type and search',
  lackOfData: 'No data!',
});
const CATEGORIES_SEPARATOR = '|';

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

const findNodeToPreSelect = (output, processedPreSelectedCategory, node) => {
  output.activeKey += node.key;

  if (Array.isArray(node.nodes)) {
    output.openedNodes.push(node.key);
    processedPreSelectedCategory.shift();

    if (processedPreSelectedCategory.length) {
      const subCategoryName = processedPreSelectedCategory.shift();
      const subNode = node.nodes.find((subNodeItem) => subNodeItem.label === subCategoryName);

      output.activeKey += '/';
      findNodeToPreSelect(output, processedPreSelectedCategory, subNode);
    }
  }
};

function useTreeMetaData({ preSelectedCategory, onCategorySelect }) {
  const [categoriesMap, setCategoriesMap] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [treeInitials, setTreeInitials] = useState(null);
  const [autoSelectedCategory, setAutoSelectedCategory] = useState(false);
  const parsedPreSelectedCategory = preSelectedCategory.split(CATEGORIES_SEPARATOR);

  useEffect(() => {
    httpService.getProductCategories().then((res) => {
      if (res.__EXCEPTION_ALREADY_HANDLED) {
        return;
      }

      setCategoriesMap(res);
    });
  }, []);

  useEffect(() => {
    if (!categoriesMap) {
      return;
    }

    setTreeData(categoriesMap.map(treeRecursiveMapper));
  }, [categoriesMap]);

  useEffect(() => {
    if (!treeData) {
      return;
    }

    if (!treeInitials) {
      // TODO: [UX] set initial tree data from any previous component "session"
      updateTreeInitials();
    }
  }, [treeData]);

  useEffect(() => {
    if (!treeInitials) {
      return;
    }

    if (treeInitials.activeKey && !autoSelectedCategory) {
      setAutoSelectedCategory(true);
      onCategorySelect(preSelectedCategory);
    }
  }, [treeInitials]);

  const updateTreeInitials = (alreadySelectedCategory) => {
    // TODO: [DX/babel] refactor to modern JS syntax `&&=`
    alreadySelectedCategory = alreadySelectedCategory && [alreadySelectedCategory];

    setTreeInitials(() => {
      const prepareNodeFindPreSelect = (output, categories, node) => {
        if (node.label === categories[0]) {
          findNodeToPreSelect(output, [...categories], node);
        }
      };

      return treeData.reduce(
        (output, node) => {
          prepareNodeFindPreSelect(output, alreadySelectedCategory || parsedPreSelectedCategory, node);

          return output;
        },
        { activeKey: '', openedNodes: [] }
      );
    });
  };

  return { treeData, treeInitials, updateTreeInitials };
}

function Tree({
  treeData,
  treeInitials,
  toggleActiveTreeNode,
  activeTreeNodes,
  categoriesTreeRef,
  formField,
  isTreeHidden,
}) {
  if (!treeData || !treeInitials) {
    return null;
  }

  // TODO: [refactor] dirty workaround to show already selected nodes (unfortunately, except nested ones)
  useEffect(() => {
    if (!isTreeHidden && activeTreeNodes.current.size > 1 && categoriesTreeRef.current) {
      const firstActiveTreeNode = categoriesTreeRef.current.querySelector('.rstm-tree-item--active');

      if (firstActiveTreeNode) {
        // click twice to "toggle" the first active node, which will automatically activate remaining ones
        window.setTimeout(() => {
          firstActiveTreeNode.click();

          window.setTimeout(() => {
            firstActiveTreeNode.click();
          });
        });
      }
    }
  }, [isTreeHidden]);

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
    <div
      ref={categoriesTreeRef}
      className={classNames('categories-tree', {
        'categories-tree--hidden': isTreeHidden,
      })}
    >
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

            <List className="rstm-tree-item-group">
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

function CategoriesTree({ preSelectedCategory = '', onCategorySelect, isMultiselect, formField, forceCombinedView }) {
  const isMobileLayout = useMobileLayout();
  const isSeparatedView = isMobileLayout && !forceCombinedView;
  const [isTreeHidden, setIsTreeHidden] = useState(isSeparatedView);
  const { treeData, treeInitials, updateTreeInitials } = useTreeMetaData({
    preSelectedCategory,
    onCategorySelect,
  });
  const categoriesTreeRef = useRef();
  const activeTreeNodes = useRef(new Map());

  useEffect(() => setIsTreeHidden(isSeparatedView), [isMobileLayout]);

  const handleCategoriesTreeToggle = () => setIsTreeHidden(!isTreeHidden);

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
    onCategorySelect(isMultiselect ? activeCategoryNames : activeCategoryNames[0]);

    if (isMultiselect) {
      updateTreeInitials(activeCategoryNames[0]);
    }
  };
  toggleActiveTreeNode.matchParentKey = (treeData, clickedItem) => {
    const matchedParent = treeData.find((node) => clickedItem.parent && clickedItem.parent === node.key);
    return matchedParent ? `${matchedParent.label}${CATEGORIES_SEPARATOR}` : '';
  };

  if (!treeData) {
    return translations.lackOfData;
  }

  return isSeparatedView ? (
    <>
      <PEVIconButton onClick={handleCategoriesTreeToggle} a11y={translations.toggleCategoriesTree}>
        <AccountTree />
      </PEVIconButton>
      <Drawer anchor="left" open={!isTreeHidden} onClose={handleCategoriesTreeToggle}>
        <section>
          <PEVIconButton
            onClick={handleCategoriesTreeToggle}
            className="MuiButton-fullWidth"
            a11y={translations.toggleCategoriesTree}
          >
            <ArrowBack />
          </PEVIconButton>

          <PEVHeading level={3}>{translations.treeHeader}</PEVHeading>

          <Tree
            treeData={treeData}
            treeInitials={treeInitials}
            toggleActiveTreeNode={toggleActiveTreeNode}
            activeTreeNodes={activeTreeNodes}
            categoriesTreeRef={categoriesTreeRef}
            formField={formField}
            isTreeHidden={isTreeHidden}
          />
        </section>
      </Drawer>
    </>
  ) : (
    <section>
      <PEVHeading level={3}>{translations.treeHeader}</PEVHeading>
      <Tree
        treeData={treeData}
        treeInitials={treeInitials}
        toggleActiveTreeNode={toggleActiveTreeNode}
        activeTreeNodes={activeTreeNodes}
        categoriesTreeRef={categoriesTreeRef}
        formField={formField}
        isTreeHidden={isTreeHidden}
      />
    </section>
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
