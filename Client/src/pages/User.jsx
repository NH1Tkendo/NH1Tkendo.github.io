// components/UserPage/index.jsx
import { useContext, useEffect, useState } from 'react';
import FileGrid from '../components/UserResourcePage/FileGrid';
import FileList from '../components/UserResourcePage/FileList';
import Sidebar from '../components/UserResourcePage/Sidebar';
import TopBar from '../components/UserResourcePage/TopBar';
import UploadModal from '../components/UserResourcePage/UploadModal';
import DocumentViewer from '../components/UserResourcePage/DocumentViewer';
import ContextMenu from '../components/UserResourcePage/ContextMenu';
import RenameModal from '../components/UserResourcePage/RenameModal';
import { useFileUpload } from '../components/UserResourcePage/hooks/useFileUpload';
import { useFileView } from '../components/UserResourcePage/hooks/useFileView';
import { loadFile } from '../components/UserResourcePage/utils/loadFiles';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function UserPage() {
  const { user } = useContext(AuthContext);
  const [uploadedLessons, setUploadedLessons] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameModal, setRenameModal] = useState({ isOpen: false, document: null });

  const { activeView, setActiveView, viewMode, setViewMode, viewTitle } = useFileView();
  const { file, previewUrl, uploading, uploadProgress, handleChange, handleUpload, reset } = useFileUpload();

  // Function để reload danh sách documents
  const fetchDocuments = async () => {
    try {
      const data = await loadFile();
      if (data) {
        setUploadedLessons(data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const data = await loadFile();
      if (mounted && data) {
        setUploadedLessons(data);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleCloseModal = () => {
    setShowUploadModal(false);
    reset();
  };

  const handleUploadClick = async () => {
    try {
      await handleUpload();
      handleCloseModal();
      // Reload danh sách sau khi upload thành công
      await fetchDocuments();
    } catch (error) {
      // Error đã được handle trong handleUpload
      console.error('Upload failed:', error);
    }
  };

  const handleFileClick = (document) => {
    setSelectedDocument(document);
  };

  const handleCloseViewer = () => {
    setSelectedDocument(null);
  };

  const handleContextMenu = (e, document) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      document,
    });
  };

  const handleMoreClick = (e, document) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      x: rect.left,
      y: rect.bottom + 5,
      document,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleRename = (documentId, newName) => {
    // TODO: Call API to rename document
    console.log('Rename document:', documentId, 'to:', newName);
    
    // Update local state
    setUploadedLessons(prev =>
      prev.map(doc =>
        doc.id === documentId ? { ...doc, name: newName } : doc
      )
    );
    
    toast.success('Đổi tên tài liệu thành công!');
  };

  const handleDownload = (document) => {
    // Create a temporary link and trigger download
    const link = window.document.createElement('a');
    link.href = document.file_url || document.url;
    link.download = document.name;
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast.success('Đang tải xuống tài liệu...');
  };

  return (
    <div className="flex pt-[88px]" style={{ height: '100vh' }}>
      <Sidebar
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        onUploadClick={() => setShowUploadModal(true)}
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <TopBar viewMode={viewMode} onViewModeChange={setViewMode} />

        <div className="p-6">
          <h1 className="mb-6 text-2xl font-medium text-gray-800">{viewTitle}</h1>

          {viewMode === 'grid' ? (
            <FileGrid 
              files={uploadedLessons} 
              onFileClick={handleFileClick}
              onContextMenu={handleContextMenu}
              onMoreClick={handleMoreClick}
            />
          ) : (
            <FileList 
              files={uploadedLessons} 
              onFileClick={handleFileClick}
              onContextMenu={handleContextMenu}
              onMoreClick={handleMoreClick}
            />
          )}
        </div>
      </main>
      
      <UploadModal
        isOpen={showUploadModal}
        onClose={handleCloseModal}
        file={file}
        previewUrl={previewUrl}
        onFileChange={handleChange}
        onUpload={handleUploadClick}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />
      
      {selectedDocument && (
        <DocumentViewer 
          document={selectedDocument} 
          onClose={handleCloseViewer} 
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onRename={() => {
            setRenameModal({ isOpen: true, document: contextMenu.document });
          }}
          onDownload={() => {
            handleDownload(contextMenu.document);
          }}
        />
      )}

      <RenameModal
        isOpen={renameModal.isOpen}
        document={renameModal.document}
        onClose={() => setRenameModal({ isOpen: false, document: null })}
        onRename={handleRename}
      />
    </div>
  );
}
