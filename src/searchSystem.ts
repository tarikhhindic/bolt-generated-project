interface AudioFile {
      id: string;
      url: string;
      tags: string[];
      metadata: { [key: string]: string };
    }

    interface SearchCriteria {
      tags?: string[];
      metadata?: { [key: string]: string };
    }

    interface SavedSearch {
      id: string;
      name: string;
      criteria: SearchCriteria;
    }

    class SearchSystem {
      private audioFiles: AudioFile[];
      private savedSearches: SavedSearch[];

      constructor() {
        this.audioFiles = [];
        this.savedSearches = [];
      }

      addAudioFile(audioFile: AudioFile): void {
        this.audioFiles.push(audioFile);
      }

      search(criteria: SearchCriteria): AudioFile[] {
        return this.audioFiles.filter(file => {
          if (criteria.tags && !criteria.tags.every(tag => file.tags.includes(tag))) {
            return false;
          }
          if (criteria.metadata) {
            for (const [key, value] of Object.entries(criteria.metadata)) {
              if (file.metadata[key] !== value) {
                return false;
              }
            }
          }
          return true;
        });
      }

      saveSearch(name: string, criteria: SearchCriteria): void {
        const id = Date.now().toString();
        this.savedSearches.push({ id, name, criteria });
      }

      getSavedSearches(): SavedSearch[] {
        return this.savedSearches;
      }

      getAudioFiles(): AudioFile[] {
        return this.audioFiles;
      }
    }

    export default SearchSystem;
