import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Book, Code, FileCode, Loader2 } from "lucide-react";
import { generateUserGuidePDF } from "@/lib/generateUserGuidePDF";
import { useToast } from "@/hooks/use-toast";

const Documentation = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      generateUserGuidePDF();
      toast({
        title: "PDF Generated",
        description: "User Guide PDF has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const docs = [
    {
      title: "Technical README",
      description: "Architecture overview, tech stack, quick start guide, and deployment instructions.",
      icon: FileCode,
      file: "docs/README.md",
    },
    {
      title: "User Guide",
      description: "Complete operator training manual with workflows, best practices, and keyboard shortcuts.",
      icon: Book,
      file: "docs/USER_GUIDE.md",
      downloadable: true,
    },
    {
      title: "Component Library",
      description: "Detailed documentation of all UI components, props, and design tokens.",
      icon: Code,
      file: "docs/COMPONENTS.md",
    },
    {
      title: "API Reference",
      description: "Backend API specifications, WebSocket events, and data type definitions.",
      icon: FileText,
      file: "docs/API_REFERENCE.md",
    },
  ];

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Access all system documentation and training materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docs.map((doc) => (
            <Card key={doc.title} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <doc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {doc.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/${doc.file}`} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Markdown
                    </a>
                  </Button>
                  {doc.downloadable && (
                    <Button 
                      size="sm" 
                      onClick={handleDownloadPDF}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Download Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Offline Training Materials
            </CardTitle>
            <CardDescription>
              Download the User Guide as a PDF for offline operator training sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">SOC Dashboard User Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Complete training manual including workflows, best practices, and reference tables. 
                  Suitable for printing or digital distribution.
                </p>
              </div>
              <Button onClick={handleDownloadPDF} disabled={isGenerating} className="shrink-0">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Documentation;
