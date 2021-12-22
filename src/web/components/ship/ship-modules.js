export default function ShipModules ({ name, modules, selectedModule, setSelectedModule = () => {} }) {
  return (
    <>
      <h2 style={{ margin: '1rem 0' }} className='text-info text-muted'>{name}</h2>
      <table className='table--flex-inline table--interactive'>
        <tbody>
          {modules.sort((a, b) => (b?.class ?? 0) - (a?.class ?? 0)).map(module => {
            return (
              <tr
                key={`${name}_${module.name}_${module.slot}`}
                tabIndex='3'
                onFocus={() => setSelectedModule(module)}
                data-module-slot={module.slot}
                className={selectedModule && selectedModule.slot === module.slot ? 'table__row--active' : null}
              >
                <td className='ship-panel__module'>
                  <div
                    style={{
                      height: '100%',
                      width: '5.5rem',
                      margin: '0 .5rem 0 -.5rem',
                      float: 'left'
                    }} className='text-center'
                  >
                    {module.size && module.size !== 'tiny' &&
                      <div
                        style={{
                          width: '5.5rem',
                          paddingBottom: '.5rem'
                        }} className='ship-panel__module-icon'
                      >
                        <div style={{
                          fontSize: '3.5rem'
                        }}
                        >
                          {module.class && <>{module.class}{module.rating}</>}
                          {!module.class && <>?</>}
                        </div>
                        {module.size}
                      </div>}
                    {(!module.size || module.size === 'tiny') &&
                      <div
                        style={{
                          width: '5.5rem',
                          paddingTop: '.75rem',
                          paddingBottom: '1.25rem'
                        }} className='ship-panel__module-icon'
                      >
                        <div style={{
                          fontSize: '3.5rem'
                        }}
                        >
                          {module.class && <>{module.class}{module.rating}</>}
                          {!module.class && <>?</>}
                        </div>
                      </div>}
                  </div>
                  <h3>
                  {module.mount} {module.name}
                  </h3>
                  <p>
                    {module.slotName}
                  </p>
                  {module?.power > 0 &&
                    <p>
                      <span className='text-muted'>Power</span> {parseFloat(module.power).toFixed(2)} MW
                    </p>}
                  {module.ammoInClip && !module.passengers &&
                    <p>
                      <span className='text-muted'>Ammo</span> {module.ammoInClip + module.ammoInHopper}
                    </p>}
                  {module.passengers &&
                    <p>
                      <span className='text-muted'>Passengers</span> {module.passengers}
                    </p>}
                  {module.engineering &&
                    <div className='ship-panel__engineering'>
                      {[...Array(module.engineering.level)].map((j, i) =>
                        <i
                          key={`${name}_${module.name}_${module.slot}_engineering_${i}`}
                          className='icon icarus-terminal-engineering'
                        />
                      )}
                    </div>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
