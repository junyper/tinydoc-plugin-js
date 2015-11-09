const React = require('react');
const ClassBrowser = require('components/ClassBrowser');
const OutletManager = require('core/OutletManager');
const { shape, string } = React.PropTypes;

module.exports = function(routeName, config) {
  const { navigationLabel } = config;

  OutletManager.add('SinglePageLayout::ContentPanel', {
    component: require('../screens/AllModules')(routeName, config),
    key: `${routeName}-all-modules`
  });

  OutletManager.add('SinglePageLayout::Sidebar', {
    key: `${routeName}-class-browser`,
    component: React.createClass({
      propTypes: {
        params: shape({
          moduleId: string,
          entity: string,
        })
      },

      render() {
        const { moduleId, entity } = this.props.params;

        return (
          <div>
            {navigationLabel && (
              <header className="single-page-layout__sidebar-header">
                {navigationLabel}
              </header>
            )}

            <ClassBrowser
              routeName={routeName}
              activeModuleId={moduleId && decodeURIComponent(moduleId)}
              activeEntityId={entity && decodeURIComponent(entity)}
              withControls={false}
            />
          </div>
        );
      }
    }),
  });
};