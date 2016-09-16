var config = require('config');
var fu = require('fileutil');
var repo = config.get('localRepo');
var git = require('simple-git')(repo);
var fs = require('fs');
var notifier = require('node-notifier');

function getAbsoluteName(name) {
  return repo + '/' + name;
}

var note_service = {
  //name为相对与git仓库根目录的路径
  create_note: function(name) {
    fu.touch(getAbsoluteName(name));
  },

  delete_note: function(name) {
    fu.delete(getAbsoluteName(name));
  },

  create_directory: function(name) {
    fu.mkdir(getAbsoluteName(name));
  },

  delete_directory: function(name) {
    fu.delete(getAbsoluteName(name));
  },

  list_dir: function(path='') {
    //文件列表
    var file_list = fu.list(getAbsoluteName(path), {
      recursive: false,
      excludeDirectory: true,
      excludeFile: false,
      matchFunction: function(item) {
        return item.filename.match('\.md$');
      }
    }, true);
    file_list = file_list.map(function(i){
      return i.filename;
    })
    //目录列表
    var dir_list = fu.list(getAbsoluteName(path), {
      recursive: false,
      excludeDirectory: false,
      excludeFile: true,
      matchFunction: function(item) {
        return item.filename.match('^[^\.]');
      }
    }, true);
    dir_list = dir_list.map(function(i){
      return i.filename;
    });

    return {
      notes: file_list,
      dirs: dir_list,
    };
  },

  save: function(name, msg, content) {
    name = getAbsoluteName(name);
    fs.writeFile(name, content, function (err) {
      if (err) throw err;
      git.add(name);
      git.commit(msg, [name]);
      notifier.notify({
        title: 'Git-Note',
        message: name + '  保存成功！！',
        wait: false,
      });
    });
  },

  getContent: function(name, callback) {
    name = getAbsoluteName(name);
    fs.readFile(name, 'utf-8', callback);
  }


};


module.exports=note_service;
