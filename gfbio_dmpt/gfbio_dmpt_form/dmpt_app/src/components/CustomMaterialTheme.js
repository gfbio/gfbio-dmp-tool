import { createTheme } from '@material-ui/core/styles';

const customMaterialTheme = createTheme({
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: "0.85rem"
            }
        }
    }
});

export default customMaterialTheme;