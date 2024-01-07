// ** MUI Theme Provider
import { PaletteMode, ThemeOptions } from '@mui/material'
import { deepmerge } from '@mui/utils'

// ** User Theme Options
import breakpoints from './breakpoints'
import overrides from './overrides'
import palette from './palette'
import shadows from './shadows'
import spacing from './spacing'
import typography from './typography'
import { Settings } from 'src/@core/context/settingsContext'
import UserThemeOptions from 'src/layouts/UserThemeOptions'

// ** Type Import

// ** Theme Override Imports

const themeOptions = (
  settings: Settings,
  overrideMode: PaletteMode,
): ThemeOptions => {
  // ** Vars
  const { skin, mode, direction, themeColor } = settings

  // ** Create New object before removing user component overrides and typography objects from userThemeOptions
  const userThemeConfig: ThemeOptions = Object.assign({}, UserThemeOptions())

  const mergedThemeConfig: ThemeOptions = deepmerge(
    {
      breakpoints: breakpoints(),
      direction,
      components: overrides(settings),
      palette: palette(
        mode === 'semi-dark' ? overrideMode : mode,
        skin,
        themeColor,
      ),
      ...spacing,
      shape: {
        borderRadius: 6,
      },
      mixins: {
        toolbar: {
          minHeight: 64,
        },
      },
      shadows: shadows(mode === 'semi-dark' ? overrideMode : mode),
      typography,
    },
    userThemeConfig,
  )

  return deepmerge(mergedThemeConfig, {
    palette: {
      primary: {
        ...(mergedThemeConfig.palette
          ? mergedThemeConfig.palette[themeColor]
          : palette(
              mode === 'semi-dark' ? overrideMode : mode,
              skin,
              themeColor,
            ).primary),
      },
    },
  })
}

export default themeOptions
