import React, { useState, useEffect } from 'react';
import { NavigationTab, Poem, VideoItem, Article } from './types';
import { getPoems, getVideos, getArticles, CMS_UPDATE_EVENT } from './lib/cmsStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { HomeSection } from './components/HomeSection';
import { PoetrySection } from './components/PoetrySection';
import { WritingSection } from './components/WritingSection';
import { AboutSection } from './components/AboutSection';
import { WorkWithWanjaSection } from './components/WorkWithWanjaSection';
import { VideosSection } from './components/VideosSection';
import { ContactSection } from './components/ContactSection';
import { CmsStudioSection } from './components/CmsStudioSection';
import { StyleGuideSection } from './components/StyleGuideSection';
import { PoemDetailModal } from './components/PoemDetailModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { BookingModal } from './components/BookingModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  // Dynamic CMS state
  const [poems, setPoems] = useState<Poem[]>(getPoems());
  const [videos, setVideos] = useState<VideoItem[]>(getVideos());
  const [articles, setArticles] = useState<Article[]>(getArticles());

  useEffect(() => {
    const handleCmsUpdate = () => {
      setPoems(getPoems());
      setVideos(getVideos());
      setArticles(getArticles());
    };
    window.addEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, handleCmsUpdate);
  }, []);

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const handleOpenPoemBySlug = (slug: string) => {
    const poem = poems.find((p) => p.slug === slug);
    if (poem) {
      setSelectedPoem(poem);
    }
  };

  const handleOpenVideoById = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      setSelectedVideo(video);
    }
  };

  // Helper to find related items for poem detail modal
  const getRelatedVideo = (poem: Poem | null): VideoItem | undefined => {
    if (!poem) return undefined;
    return videos.find((v) => v.poemSlug === poem.slug || v.youtubeId === poem.youtubeId);
  };

  const getRelatedArticle = (poem: Poem | null): Article | undefined => {
    if (!poem) return undefined;
    return articles.find((a) => a.slug === poem.relatedWritingSlug || a.relatedPoemSlug === poem.slug);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Top WCAG Accessibility Bar & Skip Link */}
      <AccessibilityToolbar onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content View Switcher */}
      <main id="main-content-region" tabIndex={-1} role="main" className="flex-1 pt-6 focus:outline-none">
        {activeTab === 'home' && (
          <HomeSection
            poems={poems}
            videos={videos}
            articles={articles}
            setActiveTab={setActiveTab}
            onOpenPoem={(poem) => setSelectedPoem(poem)}
            onOpenVideo={(video) => setSelectedVideo(video)}
            onOpenBooking={() => handleOpenBooking()}
            onOpenArticle={() => setActiveTab('writing')}
          />
        )}

        {activeTab === 'poetry' && (
          <PoetrySection
            poems={poems}
            videos={videos}
            onOpenPoem={(poem) => setSelectedPoem(poem)}
            onOpenVideo={(video) => setSelectedVideo(video)}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'writing' && (
          <WritingSection
            articles={articles}
            onOpenPoemBySlug={handleOpenPoemBySlug}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'work-with-wanja' && (
          <WorkWithWanjaSection
            onOpenBookingWithService={(serviceId) => handleOpenBooking(serviceId)}
          />
        )}

        {activeTab === 'videos' && (
          <VideosSection
            videos={videos}
            onOpenVideo={(video) => setSelectedVideo(video)}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'cms' && (
          <CmsStudioSection
            onNavigateTab={(tab) => setActiveTab(tab)}
            onPreviewPoem={(poem) => setSelectedPoem(poem)}
            onPreviewVideo={(video) => setSelectedVideo(video)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection
            onOpenBooking={() => handleOpenBooking()}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Poem Detail Modal */}
      <PoemDetailModal
        poem={selectedPoem}
        onClose={() => setSelectedPoem(null)}
        relatedVideo={getRelatedVideo(selectedPoem)}
        relatedArticle={getRelatedArticle(selectedPoem)}
        onNavigateToWriting={(slug) => {
          setSelectedPoem(null);
          setActiveTab('writing');
        }}
        onNavigateToVideo={(videoId) => {
          setSelectedPoem(null);
          handleOpenVideoById(videoId);
        }}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onOpenBooking={() => handleOpenBooking()}
        onOpenPoem={(poemSlug) => handleOpenPoemBySlug(poemSlug)}
      />

      {/* Booking Request Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={preselectedServiceId}
      />

    </div>
  );
}
