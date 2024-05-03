import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { v4 as uuidv4 } from 'uuid';

function linkifyText(text) {
    const urlPattern = /(<)?(https?:\/\/[^\s<>]+)(>)?/g;
    const parts = text.split(urlPattern);

    return parts.map((part) => {
        const isUrl = /^(https?:\/\/[^\s<>]+)$/.test(part);
        if (isUrl) {
            const regularColor = '#81B248';
            const hoverColor = '#678e3a';

            const handleMouseEnter = (e) => {
                e.currentTarget.style.color = hoverColor;
            };
            const handleMouseLeave = (e) => {
                e.currentTarget.style.color = regularColor;
            };

            return (
                <a
                    key={uuidv4()}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: regularColor,
                        textDecoration: 'none',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {part}
                </a>
            );
        }
        return <span key={uuidv4()}>{part}</span>;
    });
}

function PinnableTooltip({ helptext }) {
    const [open, setOpen] = React.useState(false);
    const [openedByClick, setOpenedByClick] = React.useState(false);

    const handleTooltipIconClicked = () => {
        setOpenedByClick(!openedByClick);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleTooltipIconClicked();
        }
    };

    const renderIcon = () => {
        if (openedByClick) {
            return <i className="helpicon-pin pin mdi mdi-pin" />;
        }
        if (open) {
            return <i className="helpicon-pin mdi mdi-pin-off" />;
        }
        return <i className="helpicon-pin mdi mdi-blank" />;
    };

    if (helptext === '') {
        return <></>;
    }

    return (
        <Tooltip
            PopperProps={{
                modifiers: {
                    preventOverflow: {
                        padding: 10,
                    },
                },
                style: {
                    zIndex: 1500, // high value to ensure tooltip appears above other content
                    pointerEvents: 'auto', // enables the tooltip to capture mouse events
                },
            }}
            open={openedByClick || open}
            title={<Typography>{linkifyText(helptext)}</Typography>}
            placement="right"
        >
            <span
                role="button"
                aria-pressed={openedByClick}
                tabIndex={0}
                onClick={handleTooltipIconClicked}
                onKeyDown={handleKeyPress}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(openedByClick)}
            >
                <i className="labelHelpIcon mdi mdi-help-circle-outline" />
                {renderIcon()}
            </span>
        </Tooltip>
    );
}

PinnableTooltip.propTypes = {
    helptext: PropTypes.string.isRequired,
};

export default PinnableTooltip;
