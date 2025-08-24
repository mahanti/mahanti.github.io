# SPA fallback generator for client-side routing
# This creates HTML files for all SPA routes that redirect to the main index

Jekyll::Hooks.register :site, :post_write do |site|
  # Define your SPA routes
  spa_routes = [
    '/work',
    '/work/ando',
    '/work/angellist', 
    '/work/block',
    '/work/proto',
    '/work/sidecar',
    '/work/square',
    '/products',
    '/products/approach',
    '/products/circuit',
    '/products/jot',
    '/products/sudo',
    '/products/terraforms',
    '/photos',
    '/photos/harvest',
    '/photos/pch',
    '/about'
  ]

  # Create fallback HTML files for each route
  spa_routes.each do |route|
    # Skip if route is just a directory
    next if route.end_with?('/')
    
    # Create directory structure
    route_dir = File.join(site.dest, route)
    FileUtils.mkdir_p(route_dir)
    
    # Create index.html that serves the main SPA
    main_index = File.read(File.join(site.dest, 'index.html'))
    
    # Replace any absolute paths and ensure SPA loads correctly
    fallback_content = main_index
    
    File.write(File.join(route_dir, 'index.html'), fallback_content)
  end
  
  puts "✓ Generated SPA fallback routes"
end
