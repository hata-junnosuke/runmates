// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import HorizontalNavItems from './HorizontalNavItems'
import { LayoutProps } from 'src/@core/layouts/types'

// ** Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Menu Components

// ** Types
interface Props {
  settings: LayoutProps['settings']
  horizontalNavItems: NonNullable<
    NonNullable<LayoutProps['horizontalLayoutProps']>['navMenu']
  >['navItems']
}

const Navigation = (props: Props) => {
  return (
    <Box
      className='menu-content'
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& > *': {
          '&:not(:last-child)': { mr: 2 },
          ...(themeConfig.menuTextTruncate && { maxWidth: 220 }),
        },
      }}
    >
      <HorizontalNavItems {...props} />
    </Box>
  )
}

export default Navigation
