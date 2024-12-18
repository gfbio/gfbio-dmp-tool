import isTargetOptionInInputs from './isTargetOptionInInputs';

export default function getVisiblePageIdsFromInputData(ids, section, inputs) {
    const remove = [];
    ids.forEach((id) => {
        section.conditions.forEach((condition) => {
            condition.elements.forEach((element) => {
                if (
                    element.page_id === id &&
                    isTargetOptionInInputs(inputs, condition)
                ) {
                    remove.push(element.page_id);
                }
            });
        });
    });
    return remove;
}
