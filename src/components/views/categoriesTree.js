import React, { useState, useEffect } from 'react';
import apiService from '../../features/apiService';
import TreeMenu from 'react-simple-tree-menu';

export default function CategoriesTree() {
  const [categoriesMap, setCategoriesMap] = useState(null);

  useEffect(() => {
    (async () => {
      const productCategories = await apiService.getProductCategories();

      setCategoriesMap(productCategories);
    })();
  }, []);

  const getCategoriesTree = () => {
    if (categoriesMap) {
      const treeData = categoriesMap.map(getCategoriesTree.recursiveMapper);

      return <TreeMenu data={treeData} />;
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
        label: categoryItem.parentCategory,
        nodes: categoryItem.childCategories.map((item, idx, __) =>
          getCategoriesTree.recursiveMapper(item, idx, __, level + 1)
        ),
      };
    }

    return {
      key,
      label: categoryItem,
    };
  };

  return (
    <>
      [Categories Tree...]
      {getCategoriesTree()}
    </>
  );
}
