#!/usr/bin/env node

/**
 * Find 50+ local contractors in Oklahoma City for website development
 * Categories: Lawn care, Garden Design, Seasonal Care, Pond Design, Fencing, etc.
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const execPromise = util.promisify(exec);

const API_KEY = 'AIzaSyAVHzCYMtKqYIwuJgtbC5oSbKWAV3qCpJs';

async function searchContractors(query, location = 'Oklahoma City') {
  try {
    const command = `goplaces --api-key="${API_KEY}" search "${query} ${location}" --limit=10 --json`;
    const { stdout } = await execPromise(command);
    const results = JSON.parse(stdout);
    
    return results.map(place => ({
      name: place.name,
      address: place.address,
      rating: place.rating || 0,
      types: place.types || [],
      place_id: place.place_id,
      open_now: place.open_now || false
    }));
  } catch (error) {
    console.error(`Error searching ${query}:`, error.message);
    return [];
  }
}

async function findContractors() {
  console.log('=== SEARCHING FOR LOCAL CONTRACTORS IN OKLAHOMA CITY ===\n');
  
  // Contractor categories based on user's vision
  const categories = [
    // Core categories
    'lawn care service',
    'landscaping company',
    'garden design',
    
    // Expanded niches
    'pond installation',
    'fence contractor',
    'irrigation system',
    'tree service',
    'outdoor lighting',
    'patio contractor',
    'deck builder',
    'outdoor kitchen',
    'swimming pool contractor',
    'hardscaping',
    'sprinkler system',
    'garden maintenance',
    'landscape architect',
    'fence company',
    'arborist',
    'lawn fertilization',
    'weed control service',
    
    // Additional niches
    'retaining wall contractor',
    'water feature installation',
    'gazebo builder',
    'pergola contractor',
    'fire pit installation',
    'outdoor fireplace',
    'drainage solutions',
    'sod installation',
    'mulch delivery',
    'rock landscaping',
    'xeriscaping',
    'native plant nursery',
    'greenhouse builder',
    'garden shed installation',
    'compost service',
    'organic lawn care',
    'pest control',
    'mosquito control',
    'bird control',
    'snow removal service'
  ];

  const allContractors = [];
  const seenNames = new Set();

  for (const category of categories) {
    console.log(`Searching: ${category}...`);
    const contractors = await searchContractors(category);
    
    for (const contractor of contractors) {
      if (!seenNames.has(contractor.name)) {
        seenNames.add(contractor.name);
        allContractors.push({
          ...contractor,
          category: category,
          potential_website: true, // Flag for website development
          notes: '' // For manual notes
        });
      }
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Stop if we have enough
    if (allContractors.length >= 50) {
      console.log(`\nReached target of ${allContractors.length} contractors!`);
      break;
    }
  }

  console.log(`\n=== FOUND ${allContractors.length} UNIQUE CONTRACTORS ===\n`);
  
  // Group by category
  const byCategory = {};
  allContractors.forEach(contractor => {
    const cat = contractor.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(contractor);
  });

  // Print summary by category
  console.log('CONTRACTORS BY CATEGORY:');
  console.log('=======================\n');
  
  Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length) // Sort by count
    .forEach(([category, contractors]) => {
      console.log(`${category.toUpperCase()} (${contractors.length} contractors):`);
      contractors.slice(0, 3).forEach(c => {
        console.log(`  • ${c.name} (${c.rating}★) - ${c.address.split(',')[0]}`);
      });
      if (contractors.length > 3) console.log(`  ... and ${contractors.length - 3} more\n`);
    });

  // Save detailed data
  fs.writeFileSync('local-contractors-okc.json', JSON.stringify({
    total: allContractors.length,
    last_updated: new Date().toISOString(),
    categories: Object.keys(byCategory).length,
    contractors: allContractors
  }, null, 2));

  // Save CSV for easy review
  const csvHeader = 'Name,Category,Rating,Address,Place ID,Potential Website\n';
  const csvRows = allContractors.map(c => 
    `"${c.name}","${c.category}",${c.rating},"${c.address}","${c.place_id}",Yes`
  ).join('\n');
  
  fs.writeFileSync('local-contractors-okc.csv', csvHeader + csvRows);

  console.log(`\n✅ SAVED DATA:`);
  console.log(`   • ${allContractors.length} contractors to local-contractors-okc.json`);
  console.log(`   • CSV file: local-contractors-okc.csv`);
  
  // Website opportunity analysis
  console.log('\n=== WEBSITE DEVELOPMENT OPPORTUNITIES ===');
  console.log('========================================\n');
  
  const websiteOpportunities = allContractors.filter(c => {
    // Filter for good candidates: have rating, established business
    return c.rating >= 3.5 && c.address.includes('OK');
  });
  
  console.log(`Top ${Math.min(20, websiteOpportunities.length)} candidates for website development:`);
  console.log('(Prioritizing established businesses with good ratings)\n');
  
  websiteOpportunities
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20)
    .forEach((contractor, index) => {
      console.log(`${index + 1}. ${contractor.name}`);
      console.log(`   Category: ${contractor.category}`);
      console.log(`   Rating: ${contractor.rating}★`);
      console.log(`   Address: ${contractor.address.split(',')[0]}`);
      console.log(`   Website Potential: High (established, rated ${contractor.rating}★)`);
      console.log('');
    });

  return allContractors;
}

// Run if called directly
if (require.main === module) {
  findContractors().then(contractors => {
    console.log('\n=== NEXT STEPS ===');
    console.log('================\n');
    console.log('1. Review local-contractors-okc.csv for all contractors');
    console.log('2. Prioritize top 20 candidates for outreach');
    console.log('3. Update EverGreen Gardens website with these categories');
    console.log('4. Create content strategy around these service categories');
    console.log('5. Develop lead generation forms for each category');
    console.log('\nThe EverGreen Gardens website should feature:');
    console.log('• Lawn Care • Garden Design • Seasonal Care • Pond Design • Fencing');
    console.log('• Plus all other identified contractor categories');
  }).catch(error => {
    console.error('Error finding contractors:', error);
    process.exit(1);
  });
}

module.exports = { findContractors, searchContractors };