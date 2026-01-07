"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { de, vi } from "date-fns/locale";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Post } from "./types";
import { statusLabelsI18n, statusColors, postTranslations, type AdminLanguage } from "./types";
import { deletePost } from "./actions";

// ============================================
// TYPES
// ============================================

interface PostsClientProps {
  initialPosts: Post[];
}

// ============================================
// POSTS CLIENT COMPONENT
// ============================================

export function PostsClient({ initialPosts }: PostsClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const lang = language as AdminLanguage;
  const t = postTranslations[lang];
  const dateLocale = lang === "vn" ? vi : de;
  
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter posts by search
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    const { error } = await deletePost(deleteId);
    
    if (error) {
      console.error("Error deleting post:", error);
      alert(t.deleteError);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
    }
    
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.pageTitle}</h1>
          <p className="text-slate-500">{t.pageDesc}</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/admin/posts/create">
            <Plus className="w-4 h-4 mr-2" />
            {t.newPost}
          </Link>
        </Button>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={lang === "vn" ? "Tìm kiếm bài viết..." : "Beiträge suchen..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[60px]"></TableHead>
                  <TableHead>{t.title}</TableHead>
                  <TableHead className="w-[120px]">{t.status}</TableHead>
                  <TableHead className="w-[140px]">{t.createdAt}</TableHead>
                  <TableHead className="w-[80px] text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-slate-50/50">
                    {/* Cover Image */}
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Title & Slug */}
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          /blog/{post.slug}
                        </p>
                      </div>
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[post.status]}
                      >
                        {statusLabelsI18n[post.status][lang]}
                      </Badge>
                    </TableCell>
                    
                    {/* Created At */}
                    <TableCell className="text-slate-600 text-sm">
                      {format(new Date(post.created_at), "dd MMM yyyy", {
                        locale: dateLocale,
                      })}
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {post.status === "published" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                {lang === "vn" ? "Xem" : "Ansehen"}
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/${post.id}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              {t.edit}
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setDeleteId(post.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-900 mb-2">{t.noPosts}</p>
              <p className="text-slate-500 mb-6">
                {lang === "vn" 
                  ? "Bắt đầu tạo bài viết đầu tiên của bạn" 
                  : "Erstellen Sie Ihren ersten Beitrag"}
              </p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/admin/posts/create">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.newPost}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {lang === "vn" ? "Đang xóa..." : "Löschen..."}
                </span>
              ) : (
                t.delete
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
