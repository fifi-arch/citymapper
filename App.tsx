import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layers, Map, Users, Shield, Menu, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from './hooks/useAuth';
import { Issue, Comment, ArchitectResponse } from './types';

import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import MapComponent from './components/Map/MapComponent';
import IssueForm from './components/Issues/IssueForm';
import IssueCard from './components/Issues/IssueCard';
import ArchitectDashboard from './components/Dashboard/ArchitectDashboard';
import SafeSpacesTab from './components/SafeSpaces/SafeSpacesTab';

function App() {
  const { user, loading } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTraumaLayer, setShowTraumaLayer] = useState(false);
  const [currentView, setCurrentView] = useState<'map' | 'dashboard' | 'safe-spaces'>('map');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock data - in a real app, this would come from Firebase
  useEffect(() => {
    const mockIssues: Issue[] = [
      {
        id: '1',
        title: 'Poor Street Lighting on Kilimani Road',
        description: 'The street lighting along this section is inadequate, making it unsafe for pedestrians at night. Several bulbs are broken and need replacement. This creates a safety hazard especially for women and children walking home after dark.',
        category: 'unsafe',
        location: {
          lat: -1.2921,
          lng: 36.7853,
          address: 'Kilimani Road, near Yaya Center, Nairobi'
        },
        photoURL: 'https://images.pexels.com/photos/2539462/pexels-photo-2539462.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: ['user1', 'user2', 'user3'],
        comments: [
          {
            id: '1',
            text: 'This is a major safety concern, especially for women walking alone. I avoid this area after 7 PM.',
            createdBy: 'user2',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            userRole: 'community',
            userName: 'Sarah M.'
          },
          {
            id: '2',
            text: 'I can provide LED street lighting solutions that are energy-efficient and provide better illumination.',
            createdBy: 'user4',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            userRole: 'architect',
            userName: 'John Architect'
          }
        ],
        status: 'in-progress',
        architectResponses: [
          {
            id: '1',
            comment: 'I recommend installing LED street lights with motion sensors every 30 meters. This will improve safety while being energy efficient.',
            designType: 'street-lighting',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            architectName: 'John Architect'
          }
        ]
      },
      {
        id: '2',
        title: 'Blocked Drainage System Causing Flooding',
        description: 'The drainage system is completely blocked with debris and plastic waste, causing severe flooding during rainy seasons. Water stagnates for days, creating breeding grounds for mosquitoes and health hazards.',
        category: 'drainage',
        location: {
          lat: -1.2931,
          lng: 36.7863,
          address: 'Yaya Center Area, Kilimani'
        },
        photoURL: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdBy: 'user3',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: ['user3', 'user5'],
        comments: [],
        status: 'open',
        architectResponses: []
      },
      {
        id: '3',
        title: 'Abandoned Plot Becoming Security Risk',
        description: 'This empty plot has been abandoned for months and is now overgrown with weeds. It has become a hiding spot for criminals and drug users, making the neighborhood unsafe.',
        category: 'abandoned-plot',
        location: {
          lat: -1.2911,
          lng: 36.7843,
          address: 'Argwings Kodhek Road, Kilimani'
        },
        createdBy: 'user6',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: ['user6', 'user7', 'user8', 'user9'],
        comments: [
          {
            id: '3',
            text: 'This place is really scary at night. Something needs to be done urgently.',
            createdBy: 'user7',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            userRole: 'community',
            userName: 'Mary K.'
          }
        ],
        status: 'open',
        architectResponses: []
      },
      {
        id: '4',
        title: 'Excessive Noise from Construction Site',
        description: 'Construction work starts at 5 AM daily with heavy machinery, disrupting sleep and daily activities. No proper noise barriers are in place.',
        category: 'noise',
        location: {
          lat: -1.2941,
          lng: 36.7873,
          address: 'Near Kilimani Primary School'
        },
        createdBy: 'user10',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: ['user10', 'user11'],
        comments: [],
        status: 'open',
        architectResponses: []
      }
    ];
    setIssues(mockIssues);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (user?.role === 'community') {
      setNewPinLocation({ lat, lng });
      setShowIssueForm(true);
    }
  };

  const handleIssueSubmit = (newIssue: Omit<Issue, 'id' | 'createdAt' | 'upvotes' | 'comments' | 'status'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      upvotes: [],
      comments: [],
      status: 'open'
    };
    setIssues([issue, ...issues]);
    setNewPinLocation(null);
  };

  const handleUpvote = (issueId: string) => {
    if (!user) return;
    
    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        const hasUpvoted = issue.upvotes.includes(user.uid);
        return {
          ...issue,
          upvotes: hasUpvoted 
            ? issue.upvotes.filter(uid => uid !== user.uid)
            : [...issue.upvotes, user.uid]
        };
      }
      return issue;
    }));
  };

  const handleComment = (issueId: string, commentText: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      userRole: user.role,
      userName: user.displayName
    };

    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          comments: [...issue.comments, newComment]
        };
      }
      return issue;
    }));
  };

  const handleArchitectResponse = (issueId: string, response: Omit<ArchitectResponse, 'id' | 'createdAt'>) => {
    const architectResponse: ArchitectResponse = {
      ...response,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          architectResponses: [...(issue.architectResponses || []), architectResponse],
          status: 'in-progress' as const
        };
      }
      return issue;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CityMapper...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const navigationItems = [
    { id: 'map', label: 'Map View', icon: Map, description: 'Interactive map with issue pins' },
    ...(user.role === 'architect' ? [{ id: 'dashboard', label: 'Dashboard', icon: Users, description: 'Manage and respond to issues' }] : []),
    { id: 'safe-spaces', label: 'Safe Spaces', icon: Shield, description: 'Emergency centers and support' }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Header 
          onUserMenuToggle={() => setShowUserMenu(!showUserMenu)}
          showUserMenu={showUserMenu}
          onMobileMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        />

        <div className="flex">
          {/* Sidebar */}
          <AnimatePresence>
            {(showMobileMenu || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 ${
                  showMobileMenu ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="p-6 pt-20 lg:pt-6">
                  <nav className="space-y-2">
                    {navigationItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setCurrentView(item.id as any);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          currentView === item.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </motion.button>
                    ))}
                  </nav>

                  {/* Trauma Layer Toggle */}
                  {currentView === 'map' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200"
                    >
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showTraumaLayer}
                          onChange={(e) => setShowTraumaLayer(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <Layers className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-900">
                          Show Trauma Layer
                        </span>
                      </label>
                      <p className="text-xs text-red-700 mt-1">
                        Visualize unsafe areas as heatmap overlay
                      </p>
                    </motion.div>
                  )}

                  {/* Quick Add Button for Community Users */}
                  {user.role === 'community' && currentView === 'map' && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowIssueForm(true)}
                      className="mt-6 w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Report New Issue</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            <AnimatePresence mode="wait">
              {currentView === 'map' && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-screen flex"
                >
                  {/* Map */}
                  <div className="flex-1 relative">
                    <MapComponent
                      issues={issues}
                      onPinClick={setSelectedIssue}
                      onMapClick={handleMapClick}
                      showTraumaLayer={showTraumaLayer}
                    />
                  </div>

                  {/* Issue Details Sidebar */}
                  <AnimatePresence>
                    {selectedIssue && (
                      <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="w-full sm:w-96 bg-white border-l border-gray-200 overflow-y-auto"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Issue Details</h3>
                            <button
                              onClick={() => setSelectedIssue(null)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <IssueCard
                            issue={selectedIssue}
                            onUpvote={handleUpvote}
                            onComment={handleComment}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {currentView === 'dashboard' && user.role === 'architect' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ArchitectDashboard
                    issues={issues}
                    onRespond={handleArchitectResponse}
                  />
                </motion.div>
              )}

              {currentView === 'safe-spaces' && (
                <motion.div
                  key="safe-spaces"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SafeSpacesTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Issue Form Modal */}
        <AnimatePresence>
          {showIssueForm && (
            <IssueForm
              onClose={() => {
                setShowIssueForm(false);
                setNewPinLocation(null);
              }}
              onSubmit={handleIssueSubmit}
              initialLocation={newPinLocation}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;