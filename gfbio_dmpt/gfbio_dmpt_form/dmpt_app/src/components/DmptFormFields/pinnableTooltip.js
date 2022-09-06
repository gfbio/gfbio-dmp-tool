import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

function PinnableTooltip(props) {
    const [open, setOpen] = React.useState(false);
    const [openedByClick, setOpenedByClick] = React.useState(false);

    const handleTooltipIconClicked = () => {
      setOpenedByClick(!openedByClick);
    };
  
    const { helptext } = props;
    if (helptext === '') {
        return <></>
    }
    return (
        <Tooltip
            PopperProps={{
                disablePortal: true,
            }}
            open={openedByClick || open}
            title={helptext}
            placement="right"
        >
            <span onClick={handleTooltipIconClicked} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(openedByClick)}>
            <i className="labelHelpIcon mdi mdi-help-circle-outline" />
            {
                openedByClick
                ? <i className="helpicon-pin pin mdi mdi-pin" />
                : open 
                    ? <i className="helpicon-pin mdi mdi-pin-off" /> 
                    : <i className="helpicon-pin mdi mdi-blank" />
            }
            </span>
        </Tooltip>
    )
}

PinnableTooltip.propTypes = {
    helptext: PropTypes.string.isRequired,
};

export default PinnableTooltip;
