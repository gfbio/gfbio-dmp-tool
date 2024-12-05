import isTargetOptionInInputs from './isTargetOptionInInputs';

export default function getHiddenPageIdsFromConditionals(
    _section,
    _inputs,
    checkForInitialData = false
) {
    const hiddenIds = [];
    _section.conditions.forEach((condition) => {
        condition.elements.forEach((element) => {
            if (checkForInitialData) {
                if (isTargetOptionInInputs(_inputs, condition) === false) {
                    hiddenIds.push(element.page_id);
                }
            } else {
                hiddenIds.push(element.page_id);
            }
        });
    });
    return hiddenIds;
}
