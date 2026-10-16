import * as React from "react"

const TabsContext = React.createContext(null)

const Tabs = ({ defaultValue, value, onValueChange, className = "", children, ...props }) => {
  const [internalTab, setInternalTab] = React.useState(defaultValue)
  const activeTab = value !== undefined ? value : internalTab
  const setActiveTab = (next) => {
    if (onValueChange) onValueChange(next)
    if (value === undefined) setInternalTab(next)
  }
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const useTabs = () => React.useContext(TabsContext) || { activeTab: undefined, setActiveTab: () => {} }

const TabsList = ({ className = "", children, ...props }) => {
  return (
    <div className={`inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground ${className}`} {...props}>
      {children}
    </div>
  )
}

const TabsTrigger = ({ value, className = "", children, ...props }) => {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value
  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      data-state={isActive ? "active" : "inactive"}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md bg-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-[#727272] hover:underline data-[state=active]:text-foreground ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, className = "", children, ...props }) => {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

